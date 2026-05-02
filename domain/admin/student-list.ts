import { canAccessCampus, type PermissionActor } from '@/domain/auth/permissions';
import type { ServiceType, StudentStatus } from '@/domain/shared/enums';
import { maskIdentityNumber } from '@/domain/students/identity';

export type AdminStudentRecord = {
  id: string;
  name: string;
  identityNumber?: string | null;
  campusId: string;
  campusName: string;
  classId?: string | null;
  className?: string | null;
  serviceType: ServiceType;
  status: StudentStatus;
};

export type AdminStudentListItem = Omit<AdminStudentRecord, 'identityNumber'> & {
  identityNumberMasked: string;
};

export function canAccessAdminStudentList(actor: PermissionActor): boolean {
  return actor.role === 'SUPER_ADMIN' || actor.role === 'ADMIN' || actor.role === 'CAMPUS_ADMIN';
}

export function getAdminStudentListItems(
  actor: PermissionActor,
  students: readonly AdminStudentRecord[],
): AdminStudentListItem[] {
  if (!canAccessAdminStudentList(actor)) {
    return [];
  }

  return students
    .filter((student) => canAccessCampus(actor, student.campusId))
    .map(({ identityNumber, ...student }) => ({
      ...student,
      identityNumberMasked: maskIdentityNumber(identityNumber ?? null) ?? '未登记',
    }));
}

export function studentStatusLabel(status: StudentStatus): string {
  if (status === 'ACTIVE') return '在读';
  if (status === 'PAUSED') return '暂停';
  return '已离班';
}
