import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getApplicableTeacherFeeRule } from '@/domain/billing/teacher-fee-rule';

const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');

const baseRule = {
  id: 'fee-rule-teacher-wang-evening',
  campusId: 'campus-east',
  classId: 'class-rocket',
  teacherUserId: 'teacher-wang',
  serviceType: '晚辅导',
  billingMode: 'DAILY_FIXED',
  feeAmount: 220,
  effectiveFrom: new Date('2026-05-01T00:00:00.000Z'),
  effectiveTo: null,
  isActive: true,
} as const;

describe('TeacherFeeRule model and settlement fee basis', () => {
  it('defines teacher fee rules scoped by campus/class/teacher/service type', () => {
    expect(schema).toContain('enum TeacherFeeBillingMode');
    expect(schema).toContain('CLASS_FIXED');
    expect(schema).toContain('DAILY_FIXED');
    expect(schema).toContain('model TeacherFeeRule');
    expect(schema).toContain('campusId');
    expect(schema).toContain('classId');
    expect(schema).toContain('teacherUserId');
    expect(schema).toContain('serviceType');
    expect(schema).toContain('billingMode');
    expect(schema).toContain('feeAmount');
    expect(schema).toContain('effectiveFrom');
    expect(schema).toContain('effectiveTo');
    expect(schema).toContain('isActive');
    expect(schema).toContain('@@index([campusId])');
    expect(schema).toContain('@@index([teacherUserId])');
    expect(schema).toContain('@@index([serviceType])');
  });

  it('reads the active teacher fee basis for class settlement without crossing campus or service type', () => {
    const rule = getApplicableTeacherFeeRule({
      rules: [
        { ...baseRule, id: 'inactive-rule', isActive: false, feeAmount: 999 },
        { ...baseRule, id: 'other-campus-rule', campusId: 'campus-west', feeAmount: 888 },
        { ...baseRule, id: 'other-service-rule', serviceType: '下午托', feeAmount: 777 },
        baseRule,
      ],
      campusId: 'campus-east',
      classId: 'class-rocket',
      teacherUserId: 'teacher-wang',
      serviceType: '晚辅导',
      settlementDate: new Date('2026-05-20T12:00:00.000Z'),
    });

    expect(rule).toEqual({
      ruleId: 'fee-rule-teacher-wang-evening',
      billingMode: 'DAILY_FIXED',
      feeAmount: 220,
    });
  });

  it('prefers class-specific rules over campus-level teacher rules', () => {
    const rule = getApplicableTeacherFeeRule({
      rules: [
        { ...baseRule, id: 'campus-level-rule', classId: null, feeAmount: 180 },
        baseRule,
      ],
      campusId: 'campus-east',
      classId: 'class-rocket',
      teacherUserId: 'teacher-wang',
      serviceType: '晚辅导',
      settlementDate: new Date('2026-05-20T12:00:00.000Z'),
    });

    expect(rule?.ruleId).toBe('fee-rule-teacher-wang-evening');
    expect(rule?.feeAmount).toBe(220);
  });
});
