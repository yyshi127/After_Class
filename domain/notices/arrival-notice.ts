import { buildArrivalNotificationDraft } from '@/domain/attendance/attendance-record';
import type { ServiceType } from '@/domain/shared/enums';

export type NoticePushStatus = 'PENDING' | 'SENT' | 'SUPPRESSED' | 'FAILED';
export type ParentNoticeType = 'ARRIVAL';

export type ArrivalNoticeAttendanceRecord = {
  id: string;
  campusId: string;
  studentId: string;
  serviceType: ServiceType;
  checkedAt: Date | null;
  photoFileId?: string | null;
  matchStatus?: 'MATCHED' | 'PENDING_CONFIRMATION' | 'FAILED';
  notificationStatus?: 'PENDING' | 'SENT' | 'SUPPRESSED' | 'FAILED';
};

export type ArrivalNoticeGuardianBinding = {
  guardianUserId: string;
  studentId: string;
  relationship: string;
  notifyEnabled: boolean;
};

export type ParentNoticeDraft = {
  campusId: string;
  guardianUserId: string;
  studentId: string;
  attendanceRecordId: string;
  photoFileId: string | null;
  type: ParentNoticeType;
  title: string;
  message: string;
  pushStatus: NoticePushStatus;
};

export function createArrivalNoticeDrafts(input: {
  attendanceRecord: ArrivalNoticeAttendanceRecord;
  studentName: string;
  guardians: readonly ArrivalNoticeGuardianBinding[];
}): ParentNoticeDraft[] {
  if (!input.attendanceRecord.checkedAt) {
    throw new Error('到托通知必须包含到托时间');
  }

  const copy = buildArrivalNotificationDraft({
    studentName: input.studentName,
    serviceType: input.attendanceRecord.serviceType,
    checkedAt: input.attendanceRecord.checkedAt,
  });

  return input.guardians
    .filter((guardian) => guardian.studentId === input.attendanceRecord.studentId)
    .map((guardian) => ({
      campusId: input.attendanceRecord.campusId,
      guardianUserId: guardian.guardianUserId,
      studentId: input.attendanceRecord.studentId,
      attendanceRecordId: input.attendanceRecord.id,
      photoFileId: input.attendanceRecord.photoFileId ?? null,
      type: 'ARRIVAL',
      title: copy.title,
      message: copy.message,
      pushStatus: guardian.notifyEnabled ? 'PENDING' : 'SUPPRESSED',
    }));
}

export function createArrivalNoticeDraftsFromAttendance(input: {
  attendanceRecord: ArrivalNoticeAttendanceRecord;
  studentName: string;
  guardians: readonly ArrivalNoticeGuardianBinding[];
}): ParentNoticeDraft[] {
  if (
    input.attendanceRecord.matchStatus !== 'MATCHED' ||
    input.attendanceRecord.notificationStatus !== 'PENDING'
  ) {
    return [];
  }

  return createArrivalNoticeDrafts(input);
}
