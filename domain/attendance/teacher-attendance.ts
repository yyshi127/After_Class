import type { Role, TeacherAttendanceStatus } from '@/domain/shared/enums';

type TeacherAttendanceActor = {
  id: string;
  role: Role;
};

export type TeacherAttendanceDraftInput = {
  actor: TeacherAttendanceActor;
  teacherUserId: string;
  campusId: string;
  classId?: string | null;
  checkedInAt?: Date | null;
  checkedOutAt?: Date | null;
  makeupReason?: string | null;
};

export type ExistingTeacherAttendanceRecord = {
  checkedInAt: Date | null;
  checkedOutAt: Date | null;
};

export type TeacherCheckInDraftInput = TeacherAttendanceDraftInput & {
  checkedInAt: Date;
  existingTodayRecord?: ExistingTeacherAttendanceRecord | null;
};

export type TeacherCheckOutDraftInput = Omit<TeacherAttendanceDraftInput, 'checkedInAt'> & {
  checkedOutAt: Date;
  existingTodayRecord?: ExistingTeacherAttendanceRecord | null;
};

export type TeacherAttendanceDraft = {
  teacherUserId: string;
  campusId: string;
  classId: string | null;
  status: TeacherAttendanceStatus;
  checkedInAt: Date | null;
  checkedOutAt: Date | null;
  makeupByUserId: string | null;
  makeupReason: string | null;
};

const ADMIN_ROLES: readonly Role[] = ['SUPER_ADMIN', 'ADMIN', 'CAMPUS_ADMIN'];

export function createTeacherAttendanceDraft(input: TeacherAttendanceDraftInput): TeacherAttendanceDraft {
  const isAdminMakeup = ADMIN_ROLES.includes(input.actor.role);

  if (!isAdminMakeup && input.actor.id !== input.teacherUserId) {
    throw new Error('老师只能给自己签到');
  }

  return {
    teacherUserId: input.teacherUserId,
    campusId: input.campusId,
    classId: input.classId ?? null,
    status: input.checkedOutAt ? '已签退' : '已签到',
    checkedInAt: input.checkedInAt ?? null,
    checkedOutAt: input.checkedOutAt ?? null,
    makeupByUserId: isAdminMakeup ? input.actor.id : null,
    makeupReason: input.makeupReason ?? null,
  };
}

export function createTeacherCheckInDraft(input: TeacherCheckInDraftInput): TeacherAttendanceDraft {
  if (input.existingTodayRecord?.checkedInAt) {
    throw new Error('今日已签到，不能重复签到');
  }

  return createTeacherAttendanceDraft({
    ...input,
    checkedInAt: input.checkedInAt,
    checkedOutAt: null,
  });
}

export function createTeacherCheckOutDraft(input: TeacherCheckOutDraftInput): TeacherAttendanceDraft {
  if (!input.existingTodayRecord?.checkedInAt) {
    throw new Error('签退前必须先签到');
  }

  if (input.existingTodayRecord.checkedOutAt) {
    throw new Error('今日已签退，不能重复签退');
  }

  return createTeacherAttendanceDraft({
    ...input,
    checkedInAt: input.existingTodayRecord.checkedInAt,
    checkedOutAt: input.checkedOutAt,
  });
}
