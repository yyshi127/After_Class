import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { isAdminRole, isRole, roleBelongsToTerminal } from '@/domain/users/roles';

const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');

describe('user account and session foundation', () => {
  it('defines Prisma User, Account, and Session models with role support', () => {
    expect(schema).toContain('enum Role');
    expect(schema).toContain('model User');
    expect(schema).toContain('role          Role');
    expect(schema).toContain('model Account');
    expect(schema).toContain('model Session');

    for (const role of ['SUPER_ADMIN', 'CAMPUS_ADMIN', 'ADMIN', 'TEACHER', 'ASSISTANT', 'GUARDIAN', 'STUDENT']) {
      expect(schema).toContain(role);
    }
  });

  it('recognizes supported roles and rejects unknown role strings', () => {
    expect(isRole('SUPER_ADMIN')).toBe(true);
    expect(isRole('TEACHER')).toBe(true);
    expect(isRole('GUARDIAN')).toBe(true);
    expect(isRole('PARENT')).toBe(false);
  });

  it('maps roles to the correct product terminal access category', () => {
    expect(roleBelongsToTerminal('SUPER_ADMIN', 'admin')).toBe(true);
    expect(roleBelongsToTerminal('CAMPUS_ADMIN', 'admin')).toBe(true);
    expect(roleBelongsToTerminal('ADMIN', 'admin')).toBe(true);
    expect(roleBelongsToTerminal('TEACHER', 'teacher')).toBe(true);
    expect(roleBelongsToTerminal('ASSISTANT', 'teacher')).toBe(true);
    expect(roleBelongsToTerminal('GUARDIAN', 'parent')).toBe(true);
    expect(roleBelongsToTerminal('STUDENT', 'student')).toBe(true);
    expect(roleBelongsToTerminal('GUARDIAN', 'admin')).toBe(false);
  });

  it('limits operating data roles to administrators only', () => {
    expect(isAdminRole('SUPER_ADMIN')).toBe(true);
    expect(isAdminRole('CAMPUS_ADMIN')).toBe(true);
    expect(isAdminRole('ADMIN')).toBe(true);
    expect(isAdminRole('TEACHER')).toBe(false);
    expect(isAdminRole('GUARDIAN')).toBe(false);
    expect(isAdminRole('STUDENT')).toBe(false);
  });
});
