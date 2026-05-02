import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminDashboard } from '@/components/admin/admin-dashboard';

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
});
