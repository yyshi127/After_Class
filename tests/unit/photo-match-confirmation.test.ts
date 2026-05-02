import { describe, expect, it } from 'vitest';

import { createConfirmedArrivalNotificationDraft } from '@/domain/attendance/photo-match-confirmation';
import { createArrivalNoticeDraftsFromAttendance } from '@/domain/notices/arrival-notice';

const guardians = [
  {
    guardianUserId: 'demo-guardian-wang-mother',
    studentId: 'demo-student-profile-wang',
    relationship: '妈妈',
    notifyEnabled: true,
  },
];

describe('photo match confirmation flow', () => {
  it('does not generate parent notices for pending-confirmation attendance records', () => {
    const drafts = createArrivalNoticeDraftsFromAttendance({
      attendanceRecord: {
        id: 'attendance-arrival-pending',
        campusId: 'demo-campus-east',
        studentId: 'demo-student-profile-wang',
        serviceType: '晚辅导',
        checkedAt: new Date('2026-05-02T10:30:00.000Z'),
        photoFileId: 'file-arrival-photo-wang',
        matchStatus: 'PENDING_CONFIRMATION',
        notificationStatus: 'SUPPRESSED',
      },
      studentName: '王小明',
      guardians,
    });

    expect(drafts).toEqual([]);
  });

  it('creates a matched arrival draft for teacher confirmation so notices can be sent afterward', () => {
    const confirmed = createConfirmedArrivalNotificationDraft({
      attendanceRecord: {
        id: 'attendance-arrival-pending',
        campusId: 'demo-campus-east',
        classId: 'demo-class-east-g3',
        studentId: 'demo-student-profile-wang',
        teacherUserId: 'demo-teacher-li',
        serviceType: '晚辅导',
        status: '已到',
        checkedAt: new Date('2026-05-02T10:30:00.000Z'),
        photoFileId: 'file-arrival-photo-wang',
        matchStatus: 'PENDING_CONFIRMATION',
        notificationStatus: 'SUPPRESSED',
      },
      confirmedByTeacherUserId: 'demo-teacher-li',
    });

    expect(confirmed).toMatchObject({
      id: 'attendance-arrival-pending',
      matchStatus: 'MATCHED',
      notificationStatus: 'PENDING',
      confirmedByTeacherUserId: 'demo-teacher-li',
    });

    const notices = createArrivalNoticeDraftsFromAttendance({
      attendanceRecord: confirmed,
      studentName: '王小明',
      guardians,
    });

    expect(notices).toHaveLength(1);
    expect(notices[0]).toMatchObject({
      attendanceRecordId: 'attendance-arrival-pending',
      pushStatus: 'PENDING',
    });
  });
});
