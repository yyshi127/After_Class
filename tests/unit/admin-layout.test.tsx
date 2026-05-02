import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminLayout } from '@/components/admin/admin-layout';
import { getVisibleCampusesForAdmin } from '@/domain/admin/admin-layout';

const campuses = [
  { id: 'campus-east', name: '东城托管中心' },
  { id: 'campus-west', name: '西城托管中心' },
];

describe('admin layout campus scope', () => {
  it('shows only authorized campuses in the top campus filter for campus admins', () => {
    const visibleCampuses = getVisibleCampusesForAdmin(
      { id: 'admin-east', role: 'CAMPUS_ADMIN', campusIds: ['campus-east'] },
      campuses,
    );

    expect(visibleCampuses).toEqual([{ id: 'campus-east', name: '东城托管中心' }]);
  });

  it('renders sidebar, user menu and scoped campus filter', () => {
    render(
      <AdminLayout
        actor={{ id: 'admin-east', role: 'CAMPUS_ADMIN', campusIds: ['campus-east'] }}
        campuses={campuses}
        currentUserName="东城校区管理员"
      >
        <p>管理端内容区</p>
      </AdminLayout>,
    );

    expect(screen.getByRole('navigation', { name: '管理端主导航' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '用户菜单：东城校区管理员' })).toBeInTheDocument();

    const campusFilter = screen.getByLabelText('顶部校区筛选');
    expect(within(campusFilter).getByText('东城托管中心')).toBeInTheDocument();
    expect(within(campusFilter).queryByText('西城托管中心')).not.toBeInTheDocument();
  });
});
