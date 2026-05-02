import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import type { ParentSafetyArrivalAttendanceRecord, ParentSafetyArrivalStudent } from '@/domain/parent/safety-arrival';
import type { AttendanceStatus, ServiceType } from '@/domain/shared/enums';

export type GuardianAttendanceQueryEntities = {
  studentId?: string;
  date?: string;
};

export type GuardianAiAttendanceRecord = {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  checkedAt: Date | null;
  serviceType: ServiceType;
  photoEntry: string | null;
  summary: string;
};

export type GuardianAiAttendanceResponse = {
  intent: 'queryAttendance';
  risk: 'LOW';
  confirmationRequired: false;
  records: GuardianAiAttendanceRecord[];
};

type QueryGuardianAttendanceForAiInput = {
  actor: PermissionActor;
  entities: GuardianAttendanceQueryEntities;
  students: readonly ParentSafetyArrivalStudent[];
  attendanceRecords: readonly ParentSafetyArrivalAttendanceRecord[];
  now: Date;
};

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildSummary(input: {
  studentName: string;
  serviceType: ServiceType;
  status: AttendanceStatus;
  photoEntry: string | null;
}): string {
  const photoText = input.photoEntry ? '，签到照片可查看' : '，暂无签到照片';
  return `${input.studentName}今日${input.serviceType}状态：${input.status}${photoText}`;
}

export function queryGuardianAttendanceForAi(input: QueryGuardianAttendanceForAiInput): GuardianAiAttendanceResponse {
  const queryDate = input.entities.date ?? toDateKey(input.now);
  const studentById = new Map(input.students.map((student) => [student.id, student]));

  const records = input.attendanceRecords.flatMap((record) => {
    const student = studentById.get(record.studentId);

    if (!student || !canAccessStudent(input.actor, student)) {
      return [];
    }

    if (input.entities.studentId && input.entities.studentId !== student.id) {
      return [];
    }

    if (record.checkedAt && toDateKey(record.checkedAt) !== queryDate) {
      return [];
    }

    const photoEntry = record.photoFileId ?? null;

    return [
      {
        studentId: student.id,
        studentName: student.name,
        status: record.status,
        checkedAt: record.checkedAt,
        serviceType: record.serviceType,
        photoEntry,
        summary: buildSummary({
          studentName: student.name,
          serviceType: record.serviceType,
          status: record.status,
          photoEntry,
        }),
      },
    ];
  });

  return {
    intent: 'queryAttendance',
    risk: 'LOW',
    confirmationRequired: false,
    records,
  };
}
