import { describe, expect, it } from 'vitest';

import { confirmRequest, executeConfirmedRequest } from '@/domain/ai-command/confirmation-request';
import {
  buildGuardianTeacherMessageConfirmationRequest,
  createTeacherMessageDraftFromConfirmation,
} from '@/domain/ai-command/guardian-teacher-message';

describe('guardian AI teacher message confirmation', () => {
  const authorizedTeacher = {
    id: 'teacher-chen',
    name: '陈老师',
    teacherAssignments: [{ campusId: 'campus-east', classId: 'class-evening-a' }],
  };
  const unauthorizedTeacher = {
    id: 'teacher-zhao',
    name: '赵老师',
    teacherAssignments: [{ campusId: 'campus-west', classId: 'class-evening-b' }],
  };

  it('builds a medium-risk confirmation card and refuses to send before confirmation', async () => {
    const request = buildGuardianTeacherMessageConfirmationRequest({
      id: 'confirm-message-001',
      actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
      student: {
        id: 'student-wang',
        name: '王小明',
        campusId: 'campus-east',
        classId: 'class-evening-a',
      },
      message: '今晚作业可能晚点交，请老师帮忙留意。',
      candidateTeachers: [authorizedTeacher],
      rawInput: '告诉陈老师今晚作业晚点交',
      now: new Date('2026-05-02T10:00:00.000Z'),
    });
    const sentMessages: string[] = [];

    await expect(
      executeConfirmedRequest(request, async () => {
        sentMessages.push('sent');
        return { teacherUserIds: ['teacher-chen'] };
      }),
    ).rejects.toThrow('确认前不能执行中风险 AI 动作');

    expect(request).toMatchObject({
      intent: 'sendTeacherMessage',
      risk: 'MEDIUM',
      status: 'PENDING',
      confirmationRequired: true,
      summary: '向王小明的负责老师留言：今晚作业可能晚点交，请老师帮忙留意。',
      payload: {
        studentId: 'student-wang',
        message: '今晚作业可能晚点交，请老师帮忙留意。',
        teacherUserIds: 'teacher-chen',
      },
    });
    expect(sentMessages).toEqual([]);
  });

  it('sends the message only to teachers authorized for the bound student after confirmation', async () => {
    const pending = buildGuardianTeacherMessageConfirmationRequest({
      id: 'confirm-message-002',
      actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
      student: {
        id: 'student-wang',
        name: '王小明',
        campusId: 'campus-east',
        classId: 'class-evening-a',
      },
      message: '今晚作业可能晚点交，请老师帮忙留意。',
      candidateTeachers: [authorizedTeacher, unauthorizedTeacher],
      rawInput: '告诉老师今晚作业晚点交',
      now: new Date('2026-05-02T10:00:00.000Z'),
    });
    const confirmed = confirmRequest(pending, {
      confirmedByUserId: 'guardian-wang',
      confirmedAt: new Date('2026-05-02T10:01:00.000Z'),
    });

    const result = await executeConfirmedRequest(confirmed, async (request) =>
      createTeacherMessageDraftFromConfirmation({ request }),
    );

    expect(result.result).toEqual({
      studentId: 'student-wang',
      studentName: '王小明',
      senderGuardianUserId: 'guardian-wang',
      teacherUserIds: ['teacher-chen'],
      message: '今晚作业可能晚点交，请老师帮忙留意。',
      sentAt: new Date('2026-05-02T10:01:00.000Z'),
    });
    expect(result.result.teacherUserIds).not.toContain('teacher-zhao');
  });

  it('rejects teacher messages for unbound students or when no responsible teacher is authorized', () => {
    expect(() =>
      buildGuardianTeacherMessageConfirmationRequest({
        id: 'confirm-message-003',
        actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
        student: {
          id: 'student-li',
          name: '李小雨',
          campusId: 'campus-east',
          classId: 'class-evening-a',
        },
        message: '麻烦老师关注一下。',
        candidateTeachers: [authorizedTeacher],
        rawInput: '给老师留言',
        now: new Date('2026-05-02T10:00:00.000Z'),
      }),
    ).toThrow('无权为该学生留言老师');

    expect(() =>
      buildGuardianTeacherMessageConfirmationRequest({
        id: 'confirm-message-004',
        actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
        student: {
          id: 'student-wang',
          name: '王小明',
          campusId: 'campus-east',
          classId: 'class-evening-a',
        },
        message: '麻烦老师关注一下。',
        candidateTeachers: [unauthorizedTeacher],
        rawInput: '给老师留言',
        now: new Date('2026-05-02T10:00:00.000Z'),
      }),
    ).toThrow('没有可接收留言的授权老师');
  });
});
