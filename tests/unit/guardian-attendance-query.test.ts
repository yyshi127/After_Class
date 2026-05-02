import { describe, expect, it } from 'vitest';

import { queryGuardianAttendanceForAi } from '@/domain/ai-command/guardian-attendance-query';
import type { ParentSafetyArrivalAttendanceRecord, ParentSafetyArrivalStudent } from '@/domain/parent/safety-arrival';

const students: ParentSafetyArrivalStudent[] = [
  {
    id: 'student-wang',
    name: '王小明',
    campusId: 'campus-east',
    classId: 'class-evening-a',
    userId: 'student-user-wang',
  },
  {
    id: 'student-li',
    name: '李小雨',
    campusId: 'campus-west',
    classId: 'class-evening-b',
    userId: 'student-user-li',
  },
];

const attendanceRecords: ParentSafetyArrivalAttendanceRecord[] = [
  {
    id: 'attendance-wang-today',
    campusId: 'campus-east',
    classId: 'class-evening-a',
    studentId: 'student-wang',
    teacherUserId: 'teacher-chen',
    serviceType: '晚辅导',
    status: '已到',
    checkedAt: new Date('2026-05-02T09:05:00.000Z'),
    photoFileId: 'photo://arrival-wang-today',
    matchStatus: 'MATCHED',
    notificationStatus: 'SENT',
  },
  {
    id: 'attendance-li-today',
    campusId: 'campus-west',
    classId: 'class-evening-b',
    studentId: 'student-li',
    teacherUserId: 'teacher-zhao',
    serviceType: '晚辅导',
    status: '已到',
    checkedAt: new Date('2026-05-02T09:10:00.000Z'),
    photoFileId: 'photo://arrival-li-today',
    matchStatus: 'MATCHED',
    notificationStatus: 'SENT',
  },
];

describe('guardian AI attendance query', () => {
  it('returns the bound child attendance status and photo entry', () => {
    const response = queryGuardianAttendanceForAi({
      actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
      entities: { studentId: 'student-wang', date: '2026-05-02' },
      students,
      attendanceRecords,
      now: new Date('2026-05-02T10:00:00.000Z'),
    });

    expect(response).toEqual({
      intent: 'queryAttendance',
      risk: 'LOW',
      confirmationRequired: false,
      records: [
        {
          studentId: 'student-wang',
          studentName: '王小明',
          status: '已到',
          checkedAt: new Date('2026-05-02T09:05:00.000Z'),
          serviceType: '晚辅导',
          photoEntry: 'photo://arrival-wang-today',
          summary: '王小明今日晚辅导状态：已到，签到照片可查看',
        },
      ],
    });
  });

  it('does not return another child attendance even when the AI entity names that student', () => {
    const response = queryGuardianAttendanceForAi({
      actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
      entities: { studentId: 'student-li', date: '2026-05-02' },
      students,
      attendanceRecords,
      now: new Date('2026-05-02T10:00:00.000Z'),
    });

    expect(response.records).toEqual([]);
  });
});
