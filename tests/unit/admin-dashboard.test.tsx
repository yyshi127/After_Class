import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminDashboard } from '@/components/admin/admin-dashboard';

const nonEmptyMetrics = {
  arrivalsToday: 42,
  attendanceRate: 0.93,
  pendingHomeworkFeedback: 7,
  expiringServices: 5,
  estimatedGrossProfitCents: 128600,
};

describe('admin dashboard', () => {
  it('renders empty states when there is no operational data', () => {
    render(
      <AdminDashboard
        metrics={{
          arrivalsToday: 0,
          attendanceRate: null,
          pendingHomeworkFeedback: 0,
          expiringServices: 0,
          estimatedGrossProfitCents: null,
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: '今日运营看板' })).toBeInTheDocument();
    expect(screen.getByText('暂无到托记录')).toBeInTheDocument();
    expect(screen.getByText('暂无出勤数据')).toBeInTheDocument();
    expect(screen.getByText('暂无待反馈作业')).toBeInTheDocument();
    expect(screen.getByText('暂无到期提醒')).toBeInTheDocument();
    expect(screen.getByText('暂无核算数据')).toBeInTheDocument();
  });

  it('renders the M8 management dashboard UI sections with campus filter, trend, risks and todos', () => {
    render(
      <AdminDashboard
        metrics={nonEmptyMetrics}
        campusOptions={[
          { id: 'all', name: '全部校区' },
          { id: 'east', name: '东城校区' },
        ]}
        trendPoints={[
          { label: '周一', attendanceRate: 0.9, grossProfitCents: 98000 },
          { label: '周二', attendanceRate: 0.93, grossProfitCents: 128600 },
        ]}
        riskItems={[
          { id: 'expiry', title: '5 名学生 7 天内服务到期', severity: 'HIGH', owner: '校区教务', dueLabel: '今日跟进' },
        ]}
        todoItems={[
          { id: 'homework', title: '7 份作业待发布给家长', href: '/admin/homework-feedback' },
        ]}
      />,
    );

    expect(screen.getByLabelText('首页看板校区筛选')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '全部校区' })).toHaveClass('min-h-11');
    expect(screen.getByRole('button', { name: '东城校区' })).toHaveClass('min-h-11');

    const kpiRegion = screen.getByRole('region', { name: '关键运营指标' });
    expect(within(kpiRegion).getByText('42')).toBeInTheDocument();
    expect(within(kpiRegion).getByText('93%')).toBeInTheDocument();
    expect(within(kpiRegion).getByText('¥1,286')).toBeInTheDocument();

    expect(screen.getByRole('region', { name: '出勤与毛利趋势' })).toHaveTextContent('周二');
    expect(screen.getByRole('region', { name: '运营风险' })).toHaveTextContent('5 名学生 7 天内服务到期');
    expect(screen.getByRole('region', { name: '待处理事项' })).toHaveTextContent('7 份作业待发布给家长');
  });

  it('keeps the management dashboard responsive for 1024px and 1440px desktop widths', () => {
    const { container } = render(
      <AdminDashboard
        metrics={nonEmptyMetrics}
        campusOptions={[{ id: 'east', name: '东城校区' }]}
        trendPoints={[]}
        riskItems={[]}
        todoItems={[]}
      />,
    );

    expect(container.querySelector('[data-testid="admin-dashboard-shell"]')).toHaveClass('xl:grid-cols-[1.5fr_0.9fr]');
    expect(screen.getByRole('region', { name: '关键运营指标' })).toHaveClass('lg:grid-cols-5');
    expect(screen.getByRole('region', { name: '出勤与毛利趋势' })).toHaveClass('min-w-0');
  });
});
