import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminClassSettlements } from '@/components/admin/admin-class-settlements';
import { getAdminClassSettlements } from '@/domain/admin/class-settlements';

const superAdmin = { id: 'demo-super-admin', role: 'SUPER_ADMIN' as const };
const campusAdmin = {
  id: 'demo-campus-admin-east',
  role: 'CAMPUS_ADMIN' as const,
  campusIds: ['demo-campus-east'],
};

const settlements = [
  {
    id: 'settlement-east-evening',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    teacherUserIds: ['teacher-wang'],
    teacherNames: ['王老师'],
    settlementDate: new Date('2026-05-20T00:00:00.000Z'),
    expectedCount: 4,
    arrivedCount: 1,
    leaveCount: 1,
    absentCount: 1,
    pendingCount: 1,
    studentRevenueAmount: 90,
    teacherFeeAmount: 220,
    reservedCostAmount: 30,
    estimatedGrossProfitAmount: -160,
  },
  {
    id: 'settlement-west-evening',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    classId: 'demo-class-west-g3',
    className: '西城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    teacherUserIds: ['teacher-zhao'],
    teacherNames: ['赵老师'],
    settlementDate: new Date('2026-05-20T00:00:00.000Z'),
    expectedCount: 3,
    arrivedCount: 3,
    leaveCount: 0,
    absentCount: 0,
    pendingCount: 0,
    studentRevenueAmount: 270,
    teacherFeeAmount: 200,
    reservedCostAmount: 30,
    estimatedGrossProfitAmount: 40,
  },
] as const;

describe('admin class settlements', () => {
  it('lets super admin filter by campus, date, class, service type and teacher', () => {
    const visible = getAdminClassSettlements(superAdmin, settlements, {
      campusId: 'demo-campus-west',
      date: '2026-05-20',
      classId: 'demo-class-west-g3',
      serviceType: '晚辅导',
      teacherUserId: 'teacher-zhao',
    });

    expect(visible).toHaveLength(1);
    expect(visible[0]).toMatchObject({
      id: 'settlement-west-evening',
      campusName: '西城托管中心',
      className: '西城三年级晚辅 A 班',
      teacherNamesLabel: '赵老师',
      settlementDateLabel: '2026-05-20',
      studentRevenueAmountLabel: '¥270.00',
      teacherFeeAmountLabel: '¥200.00',
      estimatedGrossProfitAmountLabel: '¥40.00',
    });
  });

  it('limits campus admin to authorized campus settlements', () => {
    const visible = getAdminClassSettlements(campusAdmin, settlements, {});

    expect(visible).toHaveLength(1);
    expect(visible[0]?.campusName).toBe('东城托管中心');
    expect(visible.map((row) => row.campusName)).not.toContain('西城托管中心');
  });

  it('renders filters, attendance counts, revenue, teacher fee and gross profit', () => {
    render(<AdminClassSettlements actor={campusAdmin} settlements={settlements} />);

    expect(screen.getByRole('heading', { name: '班级核算' })).toBeInTheDocument();
    expect(screen.getByLabelText('校区筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('日期筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('班级筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('托管类型筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('老师筛选')).toBeInTheDocument();

    const eastRow = screen.getByRole('row', { name: /东城三年级晚辅 A 班/ });
    expect(within(eastRow).getByText('王老师')).toBeInTheDocument();
    expect(within(eastRow).getByText('应到 4 / 到课 1 / 请假 1 / 缺勤 1 / 待确认 1')).toBeInTheDocument();
    expect(within(eastRow).getByText('¥90.00')).toBeInTheDocument();
    expect(within(eastRow).getByText('¥220.00')).toBeInTheDocument();
    expect(within(eastRow).getByText('-¥160.00')).toBeInTheDocument();
    expect(screen.queryByText('西城托管中心')).not.toBeInTheDocument();
  });
});
