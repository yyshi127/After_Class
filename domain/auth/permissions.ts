import type { Role } from '@/domain/shared/enums';

export type TeacherAssignmentScope = {
  campusId: string;
  classId?: string | null;
};

export type PermissionActor = {
  id: string;
  role: Role;
  campusIds?: readonly string[];
  teacherAssignments?: readonly TeacherAssignmentScope[];
  guardianStudentIds?: readonly string[];
};

export type CampusScopedClass = {
  id: string;
  campusId: string;
};

export type CampusScopedStudent = {
  id: string;
  campusId: string;
  classId?: string | null;
  userId?: string | null;
};

const CAMPUS_FINANCIAL_ROLES: readonly Role[] = ['SUPER_ADMIN', 'CAMPUS_ADMIN', 'ADMIN'];

export function canAccessCampus(actor: PermissionActor, campusId: string): boolean {
  if (actor.role === 'SUPER_ADMIN' || actor.role === 'ADMIN') {
    return true;
  }

  if (actor.role === 'CAMPUS_ADMIN') {
    return actor.campusIds?.includes(campusId) ?? false;
  }

  if (actor.role === 'TEACHER' || actor.role === 'ASSISTANT') {
    return actor.teacherAssignments?.some((assignment) => assignment.campusId === campusId) ?? false;
  }

  return false;
}

export function canAccessClass(actor: PermissionActor, custodyClass: CampusScopedClass): boolean {
  if (actor.role === 'SUPER_ADMIN' || actor.role === 'ADMIN') {
    return true;
  }

  if (actor.role === 'CAMPUS_ADMIN') {
    return actor.campusIds?.includes(custodyClass.campusId) ?? false;
  }

  if (actor.role === 'TEACHER' || actor.role === 'ASSISTANT') {
    return (
      actor.teacherAssignments?.some(
        (assignment) =>
          assignment.campusId === custodyClass.campusId &&
          (assignment.classId == null || assignment.classId === custodyClass.id),
      ) ?? false
    );
  }

  return false;
}

export function canAccessStudent(actor: PermissionActor, student: CampusScopedStudent): boolean {
  if (actor.role === 'SUPER_ADMIN' || actor.role === 'ADMIN') {
    return true;
  }

  if (actor.role === 'CAMPUS_ADMIN') {
    return actor.campusIds?.includes(student.campusId) ?? false;
  }

  if (actor.role === 'TEACHER' || actor.role === 'ASSISTANT') {
    return (
      actor.teacherAssignments?.some(
        (assignment) =>
          assignment.campusId === student.campusId &&
          (assignment.classId == null || assignment.classId === student.classId),
      ) ?? false
    );
  }

  if (actor.role === 'GUARDIAN') {
    return actor.guardianStudentIds?.includes(student.id) ?? false;
  }

  if (actor.role === 'STUDENT') {
    return student.userId === actor.id;
  }

  return false;
}

export function canViewFinancials(actor: PermissionActor): boolean {
  return CAMPUS_FINANCIAL_ROLES.includes(actor.role);
}
