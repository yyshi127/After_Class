import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getGuardianVisibleServiceValidity } from '@/domain/billing/service-validity';

const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');

const billingRecord = {
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
} as const;

describe('BillingRecord model and parent-visible service validity', () => {
  it('defines campus/student scoped billing record fields needed by MVP charging', () => {
    expect(schema).toContain('enum BillingCycle');
    expect(schema).toContain('MONTHLY');
    expect(schema).toContain('SEMESTER');
    expect(schema).toContain('model BillingRecord');
    expect(schema).toContain('campusId');
    expect(schema).toContain('studentId');
    expect(schema).toContain('serviceType');
    expect(schema).toContain('billingCycle');
    expect(schema).toContain('periodStart');
    expect(schema).toContain('periodEnd');
    expect(schema).toContain('amountDue');
    expect(schema).toContain('amountPaid');
    expect(schema).toContain('balanceAmount');
    expect(schema).toContain('debtAmount');
    expect(schema).toContain('validUntil');
    expect(schema).toContain('@@index([campusId])');
    expect(schema).toContain('@@index([studentId])');
  });

  it('returns only service validity to guardians without financial amounts', () => {
    const visible = getGuardianVisibleServiceValidity({
      guardian: {
        id: 'guardian-wang',
        role: 'GUARDIAN',
        guardianStudentIds: ['student-wang'],
      },
      records: [
        billingRecord,
        {
          ...billingRecord,
          id: 'billing-li-202605',
          studentId: 'student-li',
          studentName: '李小红',
          debtAmount: 200,
        },
      ],
    });

    expect(visible).toEqual([
      {
        studentId: 'student-wang',
        studentName: '王小明',
        serviceType: '晚辅导',
        validUntil: new Date('2026-05-31T23:59:59.000Z'),
        statusLabel: '当前服务有效期至 2026-05-31',
      },
    ]);
    expect(JSON.stringify(visible)).not.toMatch(/amountDue|amountPaid|balanceAmount|debtAmount|1800|200/);
  });
});
