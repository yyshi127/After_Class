import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  buildArrivalNotificationDraft,
  createAttendanceRecordDraft,
  createStudentAttendanceStatusUpdateDraft,
  validateAttendanceStatusTransition,
} from '@/domain/attendance/attendance-record';

describe('AttendanceRecord model and service', () => {
  it('defines attendance record fields for status, time, photo, match status, notification status, and teacher', () => {
    const schema = readFileSync('prisma/schema.prisma', 'utf8');

    expect(schema).toContain('enum AttendanceStatus');
    expect(schema).toContain('enum AttendanceMatchStatus');
    expect(schema).toContain('enum AttendanceNotificationStatus');
    expect(schema).toContain('model AttendanceRecord');
    expect(schema).toContain('status             AttendanceStatus');
    expect(schema).toContain('checkedAt          DateTime?');
    expect(schema).toContain('photoFileId        String?');
    expect(schema).toContain('matchStatus        AttendanceMatchStatus');
    expect(schema).toContain('notificationStatus AttendanceNotificationStatus');
    expect(schema).toContain('teacherUserId      String?');
  });

  it('uses the required arrival notification copy for evening tutoring', () => {
    const draft = buildArrivalNotificationDraft({
      studentName: '王小明',
      serviceType: '晚辅导',
      checkedAt: new Date('2026-05-02T10:30:00.000Z'),
    });

    expect(draft.message).toContain('已到托管中心');
    expect(draft.message).not.toContain('已到学校');
  });

  it('creates arrival draft records as pending notification until teacher confirmed match is available', () => {
    const draft = createAttendanceRecordDraft({
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-g3',
      studentId: 'demo-student-profile-wang',
      teacherUserId: 'demo-teacher-li',
      serviceType: '晚辅导',
      status: '已到',
      checkedAt: new Date('2026-05-02T10:30:00.000Z'),
      photoFileId: 'file-arrival-photo',
      isMatched: true,
    });

    expect(draft).toMatchObject({
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-g3',
      studentId: 'demo-student-profile-wang',
      teacherUserId: 'demo-teacher-li',
      serviceType: '晚辅导',
      status: '已到',
      photoFileId: 'file-arrival-photo',
      matchStatus: 'MATCHED',
      notificationStatus: 'PENDING',
    });
  });

  it('allows only valid student attendance status transitions', () => {
    expect(validateAttendanceStatusTransition({ from: '待确认', to: '已到' }).ok).toBe(true);
    expect(validateAttendanceStatusTransition({ from: '待确认', to: '迟到' }).ok).toBe(true);
    expect(validateAttendanceStatusTransition({ from: '已到', to: '已离托' }).ok).toBe(true);
    expect(validateAttendanceStatusTransition({ from: '迟到', to: '已离托' }).ok).toBe(true);

    expect(validateAttendanceStatusTransition({ from: '请假', to: '已到' })).toMatchObject({
      ok: false,
      reason: '请假/缺勤记录不能直接改为到托，请先回到待确认并人工复核。',
    });
    expect(validateAttendanceStatusTransition({ from: '缺勤', to: '已离托' }).ok).toBe(false);
    expect(validateAttendanceStatusTransition({ from: '已离托', to: '已到' })).toMatchObject({
      ok: false,
      reason: '已离托记录为终态，不能再次改为到托状态。',
    });
    expect(validateAttendanceStatusTransition({ from: '待确认', to: '已离托' })).toMatchObject({
      ok: false,
      reason: '待确认学生必须先确认为已到或迟到，才能登记离托。',
    });
  });

  it('creates student attendance update drafts with suppressed notifications for non-arrival states', () => {
    const leaveDraft = createStudentAttendanceStatusUpdateDraft({
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-g3',
      studentId: 'demo-student-profile-wang',
      teacherUserId: 'demo-teacher-li',
      serviceType: '晚辅导',
      currentStatus: '已到',
      nextStatus: '已离托',
      updatedAt: new Date('2026-05-02T12:30:00.000Z'),
    });

    expect(leaveDraft).toMatchObject({
      status: '已离托',
      matchStatus: 'MATCHED',
      notificationStatus: 'SUPPRESSED',
    });

    expect(() =>
      createStudentAttendanceStatusUpdateDraft({
        campusId: 'demo-campus-east',
        classId: 'demo-class-east-g3',
        studentId: 'demo-student-profile-wang',
        teacherUserId: 'demo-teacher-li',
        serviceType: '晚辅导',
        currentStatus: '待确认',
        nextStatus: '已离托',
        updatedAt: new Date('2026-05-02T12:30:00.000Z'),
      }),
    ).toThrow('待确认学生必须先确认为已到或迟到，才能登记离托。');
  });
});
