import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  canAccessCampus,
  canAccessClass,
  canAccessStudent,
  canViewFinancials,
  type PermissionActor,
} from '@/domain/auth/permissions';

const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');

describe('guardian, teacher assignment, and RBAC permissions', () => {
  it('defines guardian-student bindings with relationship and notification settings', () => {
    expect(schema).toContain('model GuardianStudent');
    expect(schema).toContain('guardianUserId String');
    expect(schema).toContain('studentId      String');
    expect(schema).toContain('relationship   String');
    expect(schema).toContain('phone          String');
    expect(schema).toContain('notifyEnabled  Boolean');
    expect(schema).toContain('@@unique([guardianUserId, studentId])');
  });

  it('defines teacher assignments that can scope teachers to campuses and classes', () => {
    expect(schema).toContain('model TeacherAssignment');
    expect(schema).toContain('teacherUserId String');
    expect(schema).toContain('campusId      String');
    expect(schema).toContain('classId       String?');
    expect(schema).toContain('@@unique([teacherUserId, campusId, classId])');
  });

  it('allows super administrators to access all campus, class, student, and financial data', () => {
    const actor: PermissionActor = { id: 'u1', role: 'SUPER_ADMIN' };

    expect(canAccessCampus(actor, 'campus-any')).toBe(true);
    expect(canAccessClass(actor, { id: 'class-any', campusId: 'campus-any' })).toBe(true);
    expect(canAccessStudent(actor, { id: 'student-any', campusId: 'campus-any', classId: 'class-any', userId: 's1' })).toBe(true);
    expect(canViewFinancials(actor)).toBe(true);
  });

  it('limits campus administrators to assigned campuses', () => {
    const actor: PermissionActor = { id: 'u2', role: 'CAMPUS_ADMIN', campusIds: ['campus-1'] };

    expect(canAccessCampus(actor, 'campus-1')).toBe(true);
    expect(canAccessCampus(actor, 'campus-2')).toBe(false);
    expect(canAccessClass(actor, { id: 'class-1', campusId: 'campus-1' })).toBe(true);
    expect(canAccessStudent(actor, { id: 'student-1', campusId: 'campus-2', classId: 'class-2', userId: 's1' })).toBe(false);
    expect(canViewFinancials(actor)).toBe(true);
  });

  it('limits teachers to assigned campuses or classes and blocks financial data', () => {
    const actor: PermissionActor = {
      id: 'u3',
      role: 'TEACHER',
      teacherAssignments: [{ campusId: 'campus-1', classId: 'class-1' }],
    };

    expect(canAccessCampus(actor, 'campus-1')).toBe(true);
    expect(canAccessClass(actor, { id: 'class-1', campusId: 'campus-1' })).toBe(true);
    expect(canAccessClass(actor, { id: 'class-2', campusId: 'campus-1' })).toBe(false);
    expect(canAccessStudent(actor, { id: 'student-1', campusId: 'campus-1', classId: 'class-1', userId: 's1' })).toBe(true);
    expect(canAccessStudent(actor, { id: 'student-2', campusId: 'campus-1', classId: 'class-2', userId: 's2' })).toBe(false);
    expect(canViewFinancials(actor)).toBe(false);
  });

  it('limits guardians to bound students and blocks campus/class/financial data', () => {
    const actor: PermissionActor = { id: 'u4', role: 'GUARDIAN', guardianStudentIds: ['student-1'] };

    expect(canAccessCampus(actor, 'campus-1')).toBe(false);
    expect(canAccessClass(actor, { id: 'class-1', campusId: 'campus-1' })).toBe(false);
    expect(canAccessStudent(actor, { id: 'student-1', campusId: 'campus-1', classId: 'class-1', userId: 's1' })).toBe(true);
    expect(canAccessStudent(actor, { id: 'student-2', campusId: 'campus-1', classId: 'class-1', userId: 's2' })).toBe(false);
    expect(canViewFinancials(actor)).toBe(false);
  });

  it('limits students to their own student record only', () => {
    const actor: PermissionActor = { id: 'student-user-1', role: 'STUDENT' };

    expect(canAccessCampus(actor, 'campus-1')).toBe(false);
    expect(canAccessClass(actor, { id: 'class-1', campusId: 'campus-1' })).toBe(false);
    expect(canAccessStudent(actor, { id: 'student-1', campusId: 'campus-1', classId: 'class-1', userId: 'student-user-1' })).toBe(true);
    expect(canAccessStudent(actor, { id: 'student-2', campusId: 'campus-1', classId: 'class-1', userId: 'student-user-2' })).toBe(false);
    expect(canViewFinancials(actor)).toBe(false);
  });
});
