import { ROLES, type Role } from '@/domain/shared/enums';

export type ProductTerminal = 'admin' | 'teacher' | 'parent' | 'student';

const ADMIN_ROLES: readonly Role[] = ['SUPER_ADMIN', 'CAMPUS_ADMIN', 'ADMIN'];
const TEACHER_TERMINAL_ROLES: readonly Role[] = ['TEACHER', 'ASSISTANT'];

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function isAdminRole(role: Role): boolean {
  return ADMIN_ROLES.includes(role);
}

export function roleBelongsToTerminal(role: Role, terminal: ProductTerminal): boolean {
  if (terminal === 'admin') {
    return isAdminRole(role);
  }

  if (terminal === 'teacher') {
    return TEACHER_TERMINAL_ROLES.includes(role);
  }

  if (terminal === 'parent') {
    return role === 'GUARDIAN';
  }

  return role === 'STUDENT';
}
