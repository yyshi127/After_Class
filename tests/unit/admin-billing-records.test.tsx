import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminBillingRecords } from '@/components/admin/admin-billing-records';
import { getAdminBillingRecords } from '@/domain/admin/billing-records';

const campusAdmin = {
  id: 'demo-campus-admin-east',
  role: 'CAMPUS_ADMIN' as const,
  campusIds: ['demo-campus-east'],
};

const records = [
  {
    id: 'billing-east-xiaoming',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    studentId: 'demo-student-xiaoming',
    studentName: '王小明',
    serviceType: '晚辅导' as const,
    billingCycle: 'MONTHLY' as const,
    periodStart: new Date('2026-05-01T00:00:00.000Z'),
    periodEnd: new Date('2026-05-31T00:00:00.000Z'),
    validUntil: new Date('2026-05-31T00:00:00.000Z'),
    amountDue: 1800,
    amountPaid: 1800,
    balanceAmount: 0,
    debtAmount: 0,
  },
  {
    id: 'billing-east-lili',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    studentId: 'demo-student-lili',
    studentName: '李莉',
    serviceType: '晚全托' as const,
    billingCycle: 'SEMESTER' as const,
    periodStart: new Date('2026-02-20T00:00:00.000Z'),
    periodEnd: new Date('2026-07-20T00:00:00.000Z'),
    validUntil: new Date('2026-07-20T00:00:00.000Z'),
    amountDue: 7200,
    amountPaid: 7000,
    balanceAmount: 0,
    debtAmount: 200,
  },
  {
    id: 'billing-hidden-west',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    classId: 'demo-class-west-g3',
    className: '西城三年级晚辅 A 班',
    studentId: 'demo-student-west',
    studentName: '赵同学',
    serviceType: '晚辅导' as const,
    billingCycle: 'MONTHLY' as const,
    periodStart: new Date('2026-05-01T00:00:00.000Z'),
    periodEnd: new Date('2026-05-31T00:00:00.000Z'),
    validUntil: new Date('2026-05-31T00:00:00.000Z'),
    amountDue: 1800,
    amountPaid: 0,
    balanceAmount: 0,
    debtAmount: 1800,
  },
];

describe('admin billing records', () => {
  it('filters billing records by campus admin scope and formats billing fields', () => {
    const visible = getAdminBillingRecords(campusAdmin, records);

    expect(visible).toHaveLength(2);
    expect(visible.find((record) => record.id === 'billing-east-xiaoming')).toMatchObject({
      id: 'billing-east-xiaoming',
      campusName: '东城托管中心',
      studentName: '王小明',
      billingCycleLabel: '月缴',
      servicePeriodLabel: '2026-05-01 至 2026-05-31',
      validUntilLabel: '2026-05-31',
      amountDueLabel: '¥1800.00',
      amountPaidLabel: '¥1800.00',
    });
    expect(visible.map((record) => record.campusName)).not.toContain('西城托管中心');
  });

  it('does not expose full billing records to teacher or parent roles', () => {
    expect(getAdminBillingRecords({ id: 'teacher', role: 'TEACHER' }, records)).toEqual([]);
    expect(getAdminBillingRecords({ id: 'guardian', role: 'GUARDIAN' }, records)).toEqual([]);
  });

  it('renders service period, billing cycle, valid until, amount due and amount paid', () => {
    render(<AdminBillingRecords actor={campusAdmin} records={records} />);

    expect(screen.getByRole('heading', { name: '收费记录' })).toBeInTheDocument();
    const xiaomingRow = screen.getByRole('row', { name: /王小明/ });
    expect(within(xiaomingRow).getByText('东城托管中心')).toBeInTheDocument();
    expect(within(xiaomingRow).getByText('东城三年级晚辅 A 班')).toBeInTheDocument();
    expect(within(xiaomingRow).getByText('晚辅导')).toBeInTheDocument();
    expect(within(xiaomingRow).getByText('月缴')).toBeInTheDocument();
    expect(within(xiaomingRow).getByText('2026-05-01 至 2026-05-31')).toBeInTheDocument();
    expect(within(xiaomingRow).getByText('2026-05-31')).toBeInTheDocument();
    expect(within(xiaomingRow).getAllByText('¥1800.00')).toHaveLength(2);
    expect(screen.queryByText('西城托管中心')).not.toBeInTheDocument();
  });
});
