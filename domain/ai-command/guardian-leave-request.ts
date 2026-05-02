import { createAttendanceRecordDraft, type AttendanceRecordDraft } from '@/domain/attendance/attendance-record';
import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import {
  buildConfirmationRequest,
  type ConfirmationRequest,
  type ConfirmationRequestPayload,
} from '@/domain/ai-command/confirmation-request';
import type { ServiceType } from '@/domain/shared/enums';

export type GuardianLeaveRequestEntities = {
  studentId: string;
  studentName: string;
  campusId: string;
  classId?: string | null;
  serviceType: ServiceType;
  leaveDate: string;
  reason: string;
};

type BuildGuardianLeaveConfirmationRequestInput = {
  id: string;
  actor: PermissionActor;
  entities: GuardianLeaveRequestEntities;
  rawInput: string;
  now: Date;
};

type CreateLeaveAttendanceDraftInput = {
  request: ConfirmationRequest;
  teacherUserId?: string | null;
};

type LeaveRequestPayload = ConfirmationRequestPayload & GuardianLeaveRequestEntities;

const CONFIRMATION_TTL_MINUTES = 10;

function buildExpiresAt(now: Date): Date {
  return new Date(now.getTime() + CONFIRMATION_TTL_MINUTES * 60 * 1000);
}

function asLeavePayload(payload: ConfirmationRequestPayload): LeaveRequestPayload {
  return payload as LeaveRequestPayload;
}

export function buildGuardianLeaveConfirmationRequest(
  input: BuildGuardianLeaveConfirmationRequestInput,
): ConfirmationRequest {
  if (
    !canAccessStudent(input.actor, {
      id: input.entities.studentId,
      campusId: input.entities.campusId,
      classId: input.entities.classId,
    })
  ) {
    throw new Error('无权为该学生创建请假申请');
  }

  return buildConfirmationRequest({
    id: input.id,
    actorUserId: input.actor.id,
    actorRole: input.actor.role,
    intent: 'createLeaveRequest',
    rawInput: input.rawInput,
    payload: {
      studentId: input.entities.studentId,
      studentName: input.entities.studentName,
      campusId: input.entities.campusId,
      classId: input.entities.classId ?? null,
      serviceType: input.entities.serviceType,
      leaveDate: input.entities.leaveDate,
      reason: input.entities.reason,
    },
    summary: `为${input.entities.studentName}创建 ${input.entities.leaveDate} ${input.entities.serviceType}请假申请，原因：${input.entities.reason}`,
    now: input.now,
    expiresAt: buildExpiresAt(input.now),
  });
}

export function createLeaveAttendanceDraftFromConfirmation(
  input: CreateLeaveAttendanceDraftInput,
): AttendanceRecordDraft {
  if (input.request.intent !== 'createLeaveRequest') {
    throw new Error('确认卡片意图不是请假申请');
  }

  const payload = asLeavePayload(input.request.payload);

  return createAttendanceRecordDraft({
    campusId: payload.campusId,
    classId: payload.classId ?? null,
    studentId: payload.studentId,
    teacherUserId: input.teacherUserId ?? null,
    serviceType: payload.serviceType,
    status: '请假',
    checkedAt: new Date(`${payload.leaveDate}T00:00:00.000Z`),
    photoFileId: null,
    isMatched: true,
  });
}
