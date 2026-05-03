import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { DEMO_SEED } from '@/prisma/seed-data';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts: Record<string, string>;
  prisma?: { seed?: string };
};
const seedScript = readFileSync('prisma/seed.ts', 'utf8');

describe('demo seed script', () => {
  it('is wired as an executable database seed command', () => {
    expect(packageJson.scripts['db:seed']).toBe('tsx prisma/seed.ts');
    expect(packageJson.prisma?.seed).toBe('tsx prisma/seed.ts');
    expect(seedScript).toContain("from 'pg'");
    expect(seedScript).toContain('seedDemoData');
    expect(seedScript).toContain('ON CONFLICT');
  });

  it('covers the four-terminal demo operations loop', () => {
    expect(DEMO_SEED.users.map((user) => user.role)).toEqual(
      expect.arrayContaining(['SUPER_ADMIN', 'CAMPUS_ADMIN', 'TEACHER', 'GUARDIAN', 'STUDENT']),
    );
    expect(DEMO_SEED.campuses).toHaveLength(2);
    expect(DEMO_SEED.classes.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.students.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.guardianStudents.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.teacherAssignments.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.privateFiles.map((file) => file.purpose)).toEqual(
      expect.arrayContaining(['ARRIVAL_PHOTO', 'HOMEWORK_ORIGINAL', 'HOMEWORK_CORRECTED', 'PRACTICE_DOCX']),
    );
    expect(DEMO_SEED.attendanceRecords.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.homeworkReviews.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.feedbacks.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.mistakeBookItems.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.billingRecords.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.teacherFeeRules.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.classSettlements.length).toBeGreaterThanOrEqual(1);
    expect(DEMO_SEED.aiActionLogs.length).toBeGreaterThanOrEqual(1);
  });
});
