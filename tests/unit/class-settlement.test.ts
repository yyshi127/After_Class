import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { calculateClassSettlementDraft } from '@/domain/billing/class-settlement';

const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');

const settlementInput = {
  campusId: 'campus-east',
  classId: 'class-rocket',
  serviceType: '晚辅导',
  settlementDate: new Date('2026-05-20T00:00:00.000Z'),
  students: [
    { id: 'student-arrived', campusId: 'campus-east', classId: 'class-rocket', serviceType: '晚辅导', dailyRevenue: 90 },
    { id: 'student-absent', campusId: 'campus-east', classId: 'class-rocket', serviceType: '晚辅导', dailyRevenue: 90 },
    { id: 'student-leave', campusId: 'campus-east', classId: 'class-rocket', serviceType: '晚辅导', dailyRevenue: 90 },
    { id: 'student-other-campus', campusId: 'campus-west', classId: 'class-other', serviceType: '晚辅导', dailyRevenue: 999 },
  ],
  attendanceRecords: [
    { studentId: 'student-arrived', status: '已到' },
    { studentId: 'student-absent', status: '缺勤' },
    { studentId: 'student-leave', status: '请假' },
  ],
  teacherAttendances: [{ teacherUserId: 'teacher-wang', campusId: 'campus-east', classId: 'class-rocket', status: '已签到' }],
  teacherFeeRules: [
    {
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
    },
  ],
  reservedCostAmount: 30,
} as const;

describe('ClassSettlement model and campus/service scoped calculation', () => {
  it('defines settlement fields needed for revenue, teacher fee and gross margin', () => {
    expect(schema).toContain('model ClassSettlement');
    expect(schema).toContain('campusId');
    expect(schema).toContain('classId');
    expect(schema).toContain('serviceType');
    expect(schema).toContain('settlementDate');
    expect(schema).toContain('expectedCount');
    expect(schema).toContain('arrivedCount');
    expect(schema).toContain('leaveCount');
    expect(schema).toContain('absentCount');
    expect(schema).toContain('studentRevenueAmount');
    expect(schema).toContain('teacherFeeAmount');
    expect(schema).toContain('reservedCostAmount');
    expect(schema).toContain('estimatedGrossProfitAmount');
    expect(schema).toContain('@@index([campusId])');
    expect(schema).toContain('@@index([serviceType])');
    expect(schema).toContain('@@unique([campusId, classId, serviceType, settlementDate])');
  });

  it('calculates settlement by campus and service type using active teacher fee rules', () => {
    const draft = calculateClassSettlementDraft(settlementInput);

    expect(draft).toEqual({
      campusId: 'campus-east',
      classId: 'class-rocket',
      serviceType: '晚辅导',
      settlementDate: new Date('2026-05-20T00:00:00.000Z'),
      expectedCount: 3,
      arrivedCount: 1,
      leaveCount: 1,
      absentCount: 1,
      studentRevenueAmount: 90,
      teacherFeeAmount: 220,
      reservedCostAmount: 30,
      estimatedGrossProfitAmount: -160,
      teacherFeeRuleIds: ['fee-rule-teacher-wang-evening'],
    });
  });
});
