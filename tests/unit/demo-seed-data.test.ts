import { describe, expect, it } from 'vitest';

import { DEMO_SEED } from '@/prisma/seed-data';

describe('demo seed data', () => {
  it('contains two campuses and the four fixed service types for MVP demo flows', () => {
    expect(DEMO_SEED.campuses).toHaveLength(2);
    expect(DEMO_SEED.serviceTypes).toEqual(['中午托', '下午托', '晚辅导', '晚全托']);
  });

  it('contains demo users for admin, teacher, guardian, and student portals', () => {
    expect(DEMO_SEED.users.map((user) => user.role)).toEqual(
      expect.arrayContaining(['SUPER_ADMIN', 'CAMPUS_ADMIN', 'TEACHER', 'GUARDIAN', 'STUDENT']),
    );
  });

  it('contains classes, students, guardian bindings, and teacher assignments', () => {
    expect(DEMO_SEED.classes.length).toBeGreaterThan(0);
    expect(DEMO_SEED.students.length).toBeGreaterThan(0);
    expect(DEMO_SEED.guardianStudents.length).toBeGreaterThan(0);
    expect(DEMO_SEED.teacherAssignments.length).toBeGreaterThan(0);
  });
});
