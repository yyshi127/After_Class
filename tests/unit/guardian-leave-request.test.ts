import { describe, expect, it } from 'vitest';

import { confirmRequest, executeConfirmedRequest } from '@/domain/ai-command/confirmation-request';
import {
  buildGuardianLeaveConfirmationRequest,
  createLeaveAttendanceDraftFromConfirmation,
} from '@/domain/ai-command/guardian-leave-request';

describe('guardian AI leave request confirmation', () => {
  it('builds a medium-risk confirmation card and refuses writes before confirmation', async () => {
    const request = buildGuardianLeaveConfirmationRequest({
      id: 'confirm-leave-wang-20260503',
      actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
      entities: {
        studentId: 'student-wang',
        studentName: '王小明',
        campusId: 'campus-east',
        classId: 'class-evening-a',
        serviceType: '晚辅导',
        leaveDate: '2026-05-03',
        reason: '发烧',
      },
      rawInput: '帮王小明明天请假，原因是发烧',
      now: new Date('2026-05-02T09:00:00.000Z'),
    });
    const writes: string[] = [];

    await expect(
      executeConfirmedRequest(request, async () => {
        writes.push('created-leave-attendance');
        return { id: 'leave-attendance-001' };
      }),
    ).rejects.toThrow('确认前不能执行中风险 AI 动作');

    expect(request).toMatchObject({
      intent: 'createLeaveRequest',
      risk: 'MEDIUM',
      status: 'PENDING',
      confirmationRequired: true,
      summary: '为王小明创建 2026-05-03 晚辅导请假申请，原因：发烧',
      payload: {
        studentId: 'student-wang',
        leaveDate: '2026-05-03',
        reason: '发烧',
      },
    });
    expect(writes).toEqual([]);
  });

  it('creates a leave attendance draft only after the guardian confirms the card', async () => {
    const pending = buildGuardianLeaveConfirmationRequest({
      id: 'confirm-leave-wang-20260503',
      actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
      entities: {
        studentId: 'student-wang',
        studentName: '王小明',
        campusId: 'campus-east',
        classId: 'class-evening-a',
        serviceType: '晚辅导',
        leaveDate: '2026-05-03',
        reason: '发烧',
      },
      rawInput: '帮王小明明天请假，原因是发烧',
      now: new Date('2026-05-02T09:00:00.000Z'),
    });
    const confirmed = confirmRequest(pending, {
      confirmedByUserId: 'guardian-wang',
      confirmedAt: new Date('2026-05-02T09:02:00.000Z'),
    });

    const result = await executeConfirmedRequest(confirmed, async (request) =>
      createLeaveAttendanceDraftFromConfirmation({
        request,
        teacherUserId: 'teacher-chen',
      }),
    );

    expect(result.result).toMatchObject({
      campusId: 'campus-east',
      classId: 'class-evening-a',
      studentId: 'student-wang',
      teacherUserId: 'teacher-chen',
      serviceType: '晚辅导',
      status: '请假',
      checkedAt: new Date('2026-05-03T00:00:00.000Z'),
      photoFileId: null,
      matchStatus: 'MATCHED',
      notificationStatus: 'SUPPRESSED',
    });
    expect(result.request.status).toBe('EXECUTED');
  });

  it('rejects leave confirmation cards for unbound students', () => {
    expect(() =>
      buildGuardianLeaveConfirmationRequest({
        id: 'confirm-leave-li-20260503',
        actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
        entities: {
          studentId: 'student-li',
          studentName: '李小雨',
          campusId: 'campus-west',
          classId: 'class-evening-b',
          serviceType: '晚辅导',
          leaveDate: '2026-05-03',
          reason: '家中有事',
        },
        rawInput: '帮李小雨请假',
        now: new Date('2026-05-02T09:00:00.000Z'),
      }),
    ).toThrow('无权为该学生创建请假申请');
  });
});
