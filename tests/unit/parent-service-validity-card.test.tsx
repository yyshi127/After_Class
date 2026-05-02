import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ParentServiceValidityCard } from '@/components/parent/parent-service-validity-card';
import { getGuardianVisibleServiceValidity } from '@/domain/billing/service-validity';

const guardian = {
  id: 'guardian-wang',
  role: 'GUARDIAN' as const,
  guardianStudentIds: ['student-wang'],
};

const billingRecords = [
  {
    id: 'billing-wang-202605',
    campusId: 'campus-east',
    studentId: 'student-wang',
    studentName: '王小明',
    serviceType: '晚辅导',
    billingCycle: 'MONTHLY' as const,
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
    billingCycle: 'MONTHLY' as const,
    periodStart: new Date('2026-05-01T00:00:00.000Z'),
    periodEnd: new Date('2026-05-31T23:59:59.000Z'),
    amountDue: 2600,
    amountPaid: 1200,
    balanceAmount: 0,
    debtAmount: 1400,
    validUntil: new Date('2026-05-20T23:59:59.000Z'),
  },
];

describe('parent service validity card', () => {
  it('renders only bound child service validity without balances or debt amounts', () => {
    const validities = getGuardianVisibleServiceValidity({ guardian, records: billingRecords });

    render(<ParentServiceValidityCard validities={validities} />);

    expect(screen.getByRole('heading', { name: '服务有效期' })).toBeInTheDocument();
    expect(screen.getByText('王小明')).toBeInTheDocument();
    expect(screen.getByText('晚辅导')).toBeInTheDocument();
    expect(screen.getByText('当前服务有效期至 2026-05-31')).toBeInTheDocument();
    expect(screen.queryByText('李小红')).not.toBeInTheDocument();
    expect(screen.queryByText(/余额|欠费|欠费金额|应收|实收|amountDue|amountPaid|balanceAmount|debtAmount|1800|1400|2600/)).not.toBeInTheDocument();
  });
});
