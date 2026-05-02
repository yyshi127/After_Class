import { canAccessCampus, type PermissionActor } from '@/domain/auth/permissions';

export type AdminCampusOption = {
  id: string;
  name: string;
};

export function getVisibleCampusesForAdmin(
  actor: PermissionActor,
  campuses: readonly AdminCampusOption[],
): AdminCampusOption[] {
  return campuses.filter((campus) => canAccessCampus(actor, campus.id));
}
