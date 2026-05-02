import {
  buildConfirmationRequest,
  type ConfirmationRequest,
  type ConfirmationRequestPayload,
} from '@/domain/ai-command/confirmation-request';
import { canAccessStudent, type PermissionActor, type TeacherAssignmentScope } from '@/domain/auth/permissions';

export type GuardianTeacherMessageStudent = {
  id: string;
  name: string;
  campusId: string;
  classId?: string | null;
};

export type GuardianTeacherMessageCandidateTeacher = {
  id: string;
  name: string;
  teacherAssignments: readonly TeacherAssignmentScope[];
};

export type TeacherMessageDraft = {
  studentId: string;
  studentName: string;
  senderGuardianUserId: string;
  teacherUserIds: string[];
  message: string;
  sentAt: Date;
};

type BuildGuardianTeacherMessageConfirmationRequestInput = {
  id: string;
  actor: PermissionActor;
  student: GuardianTeacherMessageStudent;
  message: string;
  candidateTeachers: readonly GuardianTeacherMessageCandidateTeacher[];
  rawInput: string;
  now: Date;
};

type CreateTeacherMessageDraftFromConfirmationInput = {
  request: ConfirmationRequest;
};

type TeacherMessagePayload = ConfirmationRequestPayload & {
  studentId: string;
  studentName: string;
  message: string;
  teacherUserIds: string;
};

const CONFIRMATION_TTL_MINUTES = 10;

function buildExpiresAt(now: Date): Date {
  return new Date(now.getTime() + CONFIRMATION_TTL_MINUTES * 60 * 1000);
}

function isTeacherResponsibleForStudent(
  teacher: GuardianTeacherMessageCandidateTeacher,
  student: GuardianTeacherMessageStudent,
): boolean {
  const teacherActor: PermissionActor = {
    id: teacher.id,
    role: 'TEACHER',
    teacherAssignments: teacher.teacherAssignments,
  };

  return canAccessStudent(teacherActor, {
    id: student.id,
    campusId: student.campusId,
    classId: student.classId,
  });
}

function parseTeacherUserIds(value: string | number | boolean | null | undefined): string[] {
  if (typeof value !== 'string' || value.length === 0) {
    return [];
  }

  return value.split(',').filter(Boolean);
}

export function buildGuardianTeacherMessageConfirmationRequest(
  input: BuildGuardianTeacherMessageConfirmationRequestInput,
): ConfirmationRequest {
  if (
    !canAccessStudent(input.actor, {
      id: input.student.id,
      campusId: input.student.campusId,
      classId: input.student.classId,
    })
  ) {
    throw new Error('无权为该学生留言老师');
  }

  const authorizedTeachers = input.candidateTeachers.filter((teacher) =>
    isTeacherResponsibleForStudent(teacher, input.student),
  );

  if (authorizedTeachers.length === 0) {
    throw new Error('没有可接收留言的授权老师');
  }

  const teacherUserIds = authorizedTeachers.map((teacher) => teacher.id);

  return buildConfirmationRequest({
    id: input.id,
    actorUserId: input.actor.id,
    actorRole: input.actor.role,
    intent: 'sendTeacherMessage',
    rawInput: input.rawInput,
    payload: {
      studentId: input.student.id,
      studentName: input.student.name,
      message: input.message,
      teacherUserIds: teacherUserIds.join(','),
    },
    summary: `向${input.student.name}的负责老师留言：${input.message}`,
    now: input.now,
    expiresAt: buildExpiresAt(input.now),
  });
}

export function createTeacherMessageDraftFromConfirmation(
  input: CreateTeacherMessageDraftFromConfirmationInput,
): TeacherMessageDraft {
  if (input.request.intent !== 'sendTeacherMessage') {
    throw new Error('确认卡片意图不是留言老师');
  }

  const payload = input.request.payload as TeacherMessagePayload;

  return {
    studentId: payload.studentId,
    studentName: payload.studentName,
    senderGuardianUserId: input.request.actorUserId,
    teacherUserIds: parseTeacherUserIds(payload.teacherUserIds),
    message: payload.message,
    sentAt: input.request.confirmedAt ?? input.request.updatedAt,
  };
}
