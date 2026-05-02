import type { AttendanceStatus, ServiceType } from '@/domain/shared/enums';

export type AttendanceMatchStatus = 'MATCHED' | 'PENDING_CONFIRMATION' | 'FAILED';
export type AttendanceNotificationStatus = 'PENDING' | 'SENT' | 'SUPPRESSED' | 'FAILED';

export type AttendanceRecordDraftInput = {
  campusId: string;
  classId?: string | null;
  studentId: string;
  teacherUserId?: string | null;
  serviceType: ServiceType;
  status: AttendanceStatus;
  checkedAt?: Date | null;
  photoFileId?: string | null;
  isMatched: boolean;
};

export type AttendanceRecordDraft = AttendanceRecordDraftInput & {
  classId: string | null;
  teacherUserId: string | null;
  checkedAt: Date | null;
  photoFileId: string | null;
  matchStatus: AttendanceMatchStatus;
  notificationStatus: AttendanceNotificationStatus;
};

export type ArrivalNotificationDraft = {
  title: string;
  message: string;
};

export type AttendanceStatusTransitionInput = {
  from: AttendanceStatus;
  to: AttendanceStatus;
};

export type AttendanceStatusTransitionResult =
  | { ok: true }
  | {
      ok: false;
      reason: string;
    };

export type StudentAttendanceStatusUpdateDraftInput = Omit<
  AttendanceRecordDraftInput,
  'status' | 'checkedAt' | 'photoFileId' | 'isMatched'
> & {
  currentStatus: AttendanceStatus;
  nextStatus: AttendanceStatus;
  updatedAt: Date;
};

export function buildArrivalNotificationDraft(input: {
  studentName: string;
  serviceType: ServiceType;
  checkedAt: Date;
}): ArrivalNotificationDraft {
  const arrivalCopy = input.serviceType === '晚辅导' ? '已到托管中心' : '已到托管中心';

  return {
    title: `${input.studentName}到托通知`,
    message: `${input.studentName}${arrivalCopy}，请家长放心。`,
  };
}

export function createAttendanceRecordDraft(input: AttendanceRecordDraftInput): AttendanceRecordDraft {
  return {
    ...input,
    classId: input.classId ?? null,
    teacherUserId: input.teacherUserId ?? null,
    checkedAt: input.checkedAt ?? null,
    photoFileId: input.photoFileId ?? null,
    matchStatus: input.isMatched ? 'MATCHED' : 'PENDING_CONFIRMATION',
    notificationStatus: input.isMatched && input.status === '已到' ? 'PENDING' : 'SUPPRESSED',
  };
}

export function validateAttendanceStatusTransition(
  input: AttendanceStatusTransitionInput,
): AttendanceStatusTransitionResult {
  if (input.from === input.to) {
    return { ok: true };
  }

  if (input.from === '已离托') {
    return { ok: false, reason: '已离托记录为终态，不能再次改为到托状态。' };
  }

  if (input.to === '已离托' && input.from !== '已到' && input.from !== '迟到') {
    return { ok: false, reason: '待确认学生必须先确认为已到或迟到，才能登记离托。' };
  }

  if (input.from === '请假' || input.from === '缺勤') {
    return { ok: false, reason: '请假/缺勤记录不能直接改为到托，请先回到待确认并人工复核。' };
  }

  const allowedTransitions: Record<AttendanceStatus, readonly AttendanceStatus[]> = {
    待确认: ['已到', '迟到', '请假', '缺勤'],
    已到: ['已离托'],
    迟到: ['已离托'],
    请假: [],
    缺勤: [],
    已离托: [],
  };

  if (!allowedTransitions[input.from].includes(input.to)) {
    return { ok: false, reason: `不允许从${input.from}变更为${input.to}。` };
  }

  return { ok: true };
}

export function createStudentAttendanceStatusUpdateDraft(
  input: StudentAttendanceStatusUpdateDraftInput,
): AttendanceRecordDraft {
  const transition = validateAttendanceStatusTransition({ from: input.currentStatus, to: input.nextStatus });

  if (!transition.ok) {
    throw new Error(transition.reason);
  }

  return createAttendanceRecordDraft({
    campusId: input.campusId,
    classId: input.classId,
    studentId: input.studentId,
    teacherUserId: input.teacherUserId,
    serviceType: input.serviceType,
    status: input.nextStatus,
    checkedAt: input.updatedAt,
    photoFileId: null,
    isMatched: input.nextStatus !== '待确认',
  });
}
