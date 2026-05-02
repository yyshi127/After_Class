import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminCampusList } from '@/components/admin/admin-campus-list';
import { filterCampusesForList } from '@/domain/admin/campus-list';

const campuses = [
  { id: 'campus-east', name: '东城托管中心', address: '东城区', phone: '010-1', principalName: '陈校长', status: 'ACTIVE' as const },
  { id: 'campus-west', name: '西城托管中心', address: '西城区', phone: '010-2', principalName: '赵校长', status: 'INACTIVE' as const },
];

describe('admin campus list', () => {
  it('filters campuses by keyword and status', () => {
    expect(filterCampusesForList(campuses, { keyword: '东城', status: 'ACTIVE' })).toEqual([campuses[0]]);
    expect(filterCampusesForList(campuses, { keyword: '东城', status: 'INACTIVE' })).toEqual([]);
  });

  it('renders campus status and principal in the list', () => {
    render(<AdminCampusList campuses={campuses} filters={{ keyword: '', status: 'ALL' }} />);

    expect(screen.getByRole('heading', { name: '校区管理' })).toBeInTheDocument();
    expect(screen.getByText('东城托管中心')).toBeInTheDocument();
    expect(screen.getByText('启用')).toBeInTheDocument();
    expect(screen.getByText('陈校长')).toBeInTheDocument();
    expect(screen.getByText('停用')).toBeInTheDocument();
  });
});
