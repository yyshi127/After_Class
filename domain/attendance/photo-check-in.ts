import { canAccessStudent, type CampusScopedStudent, type PermissionActor } from '@/domain/auth/permissions';
import { createAttendanceRecordDraft, type AttendanceRecordDraft } from '@/domain/attendance/attendance-record';
import { buildPrivateFileMetadata, type PrivateFileMetadataDraft } from '@/domain/files/private-file';
import type { ServiceType } from '@/domain/shared/enums';

export type PhotoCheckInUploadDraftInput = {
  actor: PermissionActor;
  student: CampusScopedStudent;
  serviceType: ServiceType;
  checkedAt: Date;
  file: {
    originalName: string;
    mimeType: string;
    byteSize: number;
  };
  isMatched: boolean;
};

export type PhotoCheckInUploadDraft = {
  file: PrivateFileMetadataDraft;
  attendanceRecord: AttendanceRecordDraft;
};

export function createPhotoCheckInUploadDraft(input: PhotoCheckInUploadDraftInput): PhotoCheckInUploadDraft {
  if (input.actor.role !== 'TEACHER' && input.actor.role !== 'ASSISTANT') {
    throw new Error('只有老师或助教可以上传到托照片');
  }

  if (!canAccessStudent(input.actor, input.student)) {
    throw new Error('老师只能为负责学生上传到托照片');
  }

  const file = buildPrivateFileMetadata({
    campusId: input.student.campusId,
    studentId: input.student.id,
    originalName: input.file.originalName,
    mimeType: input.file.mimeType,
    byteSize: input.file.byteSize,
    purpose: 'ATTENDANCE_PHOTO',
    uploadedByUserId: input.actor.id,
  });

  const attendanceRecord = createAttendanceRecordDraft({
    campusId: input.student.campusId,
    classId: input.student.classId ?? null,
    studentId: input.student.id,
    teacherUserId: input.actor.id,
    serviceType: input.serviceType,
    status: '已到',
    checkedAt: input.checkedAt,
    photoFileId: file.storageKey,
    isMatched: input.isMatched,
  });

  return {
    file,
    attendanceRecord,
  };
}
