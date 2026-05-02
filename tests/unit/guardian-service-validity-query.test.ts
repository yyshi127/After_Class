import { describe, expect, it } from 'vitest';

import { queryGuardianServiceValidityForAi } from '@/domain/ai-command/guardian-service-validity-query';
import type { BillingRecordForServiceValidity } from '@/domain/billing/service-validity';

const guardian = {
  id: 'guardian-wang',
  role: 'GUARDIAN' as const,
  guardianStudentIds: ['student-wang'],
};

const billingRecords: BillingRecordForServiceValidity[] = [
  {
    id: 'billing-wang-202605',
    campusId: 'campus-east',
    studentId: 'student-wang',
    studentName: '王小明',
    serviceType: '晚辅导',
    billingCycle: 'MONTHLY',
    periodStart: new Date('2026-05-01T00:00:00.000Z'),
    periodEnd: new Date('2026-05-31T23:59:59.000Z'),
    amountDue: 1800,
    amountPaid: 1800,
    balanceAmount: 0,
    debtAmount: 0,
    validUntil: new Date('2026-05-31T23:59:59.000Z'),
  },
  {
    id: 'billing-li-202605',
    campusId: 'campus-east',
    studentId: 'student-li',
    studentName: '李小红',
    serviceType: '晚全托',
    billingCycle: 'MONTHLY',
    periodStart: new Date('2026-05-01T00:00:00.000Z'),
    periodEnd: new Date('2026-05-31T23:59:59.000Z'),
    amountDue: 2600,
    amountPaid: 1200,
    balanceAmount: 0,
    debtAmount: 1400,
    validUntil: new Date('2026-05-20T23:59:59.000Z'),
  },
];

describe('guardian AI service validity query', () => {
  it('returns only safe service validity and renewal guidance for bound students', () => {
    const result = queryGuardianServiceValidityForAi({ guardian, records: billingRecords });

    expect(result).toEqual([
      {
        studentId: 'student-wang',
        studentName: '王小明',
        serviceType: '晚辅导',
        validUntil: '2026-05-31',
        statusLabel: '当前服务有效期至 2026-05-31',
        renewalGuidance: '如需续费或调整托管套餐，请联系校区老师确认。',
      },
    ]);
    expect(JSON.stringify(result)).not.toMatch(
      /amountDue|amountPaid|balanceAmount|debtAmount|余额|欠费|应收|实收|1800|2600|1400/,
    );
  });

  it('does not leak non-bound student service validity even when an AI entity asks for it', () => {
    const result = queryGuardianServiceValidityForAi({
      guardian,
      records: billingRecords,
      studentEntity: { studentId: 'student-li' },
    });

    expect(result).toEqual([]);
    expect(JSON.stringify(result)).not.toContain('李小红');
  });
});
