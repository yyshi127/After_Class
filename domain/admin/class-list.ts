import { canAccessCampus, type PermissionActor } from '@/domain/auth/permissions';

export type AdminClassRecord = {
  id: string;
  name: string;
  campusId: string;
  campusName: string;
  grade: string;
  capacity: number;
  teacherNames: readonly string[];
  studentCount: number;
  expectedTodayCount: number;
};

export type AdminClassListItem = AdminClassRecord & {
  teacherSummary: string;
  capacitySummary: string;
};

export function canAccessAdminClassList(actor: PermissionActor): boolean {
  return actor.role === 'SUPER_ADMIN' || actor.role === 'ADMIN' || actor.role === 'CAMPUS_ADMIN';
}

export function getAdminClassListItems(
  actor: PermissionActor,
  classes: readonly AdminClassRecord[],
): AdminClassListItem[] {
  if (!canAccessAdminClassList(actor)) {
    return [];
  }

  return classes
    .filter((custodyClass) => canAccessCampus(actor, custodyClass.campusId))
    .map((custodyClass) => ({
      ...custodyClass,
      teacherSummary: custodyClass.teacherNames.length > 0 ? custodyClass.teacherNames.join('、') : '未分配',
      capacitySummary: `${custodyClass.studentCount}/${custodyClass.capacity}`,
    }));
}
