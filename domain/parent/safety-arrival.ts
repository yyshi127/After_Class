import { canAccessStudent, type CampusScopedStudent, type PermissionActor } from '@/domain/auth/permissions';
import type {
  AttendanceMatchStatus,
  AttendanceNotificationStatus,
} from '@/domain/attendance/attendance-record';
import type { AttendanceStatus, ServiceType } from '@/domain/shared/enums';

export type ParentSafetyArrivalAttendanceRecord = {
  id: string;
  campusId: string;
  classId?: string | null;
  studentId: string;
  teacherUserId?: string | null;
  serviceType: ServiceType;
  status: AttendanceStatus;
  checkedAt: Date | null;
  photoFileId?: string | null;
  matchStatus: AttendanceMatchStatus;
  notificationStatus: AttendanceNotificationStatus;
};

export type ParentSafetyArrivalStudent = CampusScopedStudent & {
  name: string;
};

export type ParentSafetyArrivalTeacher = {
  id: string;
  name: string;
};

export type ParentSafetyArrivalCard = {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  checkedAt: Date | null;
  serviceType: ServiceType;
  teacherName: string;
  photoFileId: string | null;
};

export function getParentSafetyArrivalCards(input: {
  actor: PermissionActor;
  attendanceRecords: readonly ParentSafetyArrivalAttendanceRecord[];
  students: readonly ParentSafetyArrivalStudent[];
  teachers: readonly ParentSafetyArrivalTeacher[];
}): ParentSafetyArrivalCard[] {
  const studentById = new Map(input.students.map((student) => [student.id, student]));
  const teacherById = new Map(input.teachers.map((teacher) => [teacher.id, teacher]));

  return input.attendanceRecords
    .map((record) => {
      const student = studentById.get(record.studentId);

      if (!student || !canAccessStudent(input.actor, student)) {
        return null;
      }

      return {
        studentId: student.id,
        studentName: student.name,
        status: record.status,
        checkedAt: record.checkedAt,
        serviceType: record.serviceType,
        teacherName: record.teacherUserId ? (teacherById.get(record.teacherUserId)?.name ?? '未记录老师') : '未记录老师',
        photoFileId: record.photoFileId ?? null,
      };
    })
    .filter((card): card is ParentSafetyArrivalCard => card !== null);
}
