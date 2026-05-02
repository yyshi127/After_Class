import type {
  AttendanceMatchStatus,
  AttendanceNotificationStatus,
} from '@/domain/attendance/attendance-record';
import type { AttendanceStatus, ServiceType } from '@/domain/shared/enums';

export type PendingPhotoMatchAttendanceRecord = {
  id: string;
  campusId: string;
  classId: string | null;
  studentId: string;
  teacherUserId: string | null;
  serviceType: ServiceType;
  status: AttendanceStatus;
  checkedAt: Date | null;
  photoFileId: string | null;
  matchStatus: AttendanceMatchStatus;
  notificationStatus: AttendanceNotificationStatus;
};

export type ConfirmedArrivalNotificationDraft = PendingPhotoMatchAttendanceRecord & {
  matchStatus: 'MATCHED';
  notificationStatus: 'PENDING';
  confirmedByTeacherUserId: string;
};

export function createConfirmedArrivalNotificationDraft(input: {
  attendanceRecord: PendingPhotoMatchAttendanceRecord;
  confirmedByTeacherUserId: string;
}): ConfirmedArrivalNotificationDraft {
  if (input.attendanceRecord.status !== '已到') {
    throw new Error('只有已到状态可以补发到托通知');
  }

  if (!input.attendanceRecord.checkedAt || !input.attendanceRecord.photoFileId) {
    throw new Error('补发到托通知必须包含到托时间和照片');
  }

  if (input.attendanceRecord.matchStatus === 'FAILED') {
    throw new Error('匹配失败记录需要重新上传或重新选择学生后再通知');
  }

  return {
    ...input.attendanceRecord,
    matchStatus: 'MATCHED',
    notificationStatus: 'PENDING',
    confirmedByTeacherUserId: input.confirmedByTeacherUserId,
  };
}
