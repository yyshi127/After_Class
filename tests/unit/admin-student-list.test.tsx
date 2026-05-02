import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminStudentList } from '@/components/admin/admin-student-list';
import { canAccessAdminStudentList, getAdminStudentListItems } from '@/domain/admin/student-list';

const students = [
  {
    id: 'student-east',
    name: '王小明',
    identityNumber: '310101201001013218',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g3',
    className: '三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: 'ACTIVE' as const,
  },
  {
    id: 'student-west',
    name: '李小红',
    identityNumber: '310101201101019999',
    campusId: 'campus-west',
    campusName: '西城托管中心',
    classId: 'class-west-g4',
    className: '四年级晚托 B 班',
    serviceType: '晚全托' as const,
    status: 'PAUSED' as const,
  },
];

describe('admin student list', () => {
  it('allows only admin roles to access the full admin student list', () => {
    expect(canAccessAdminStudentList({ id: 'super-admin', role: 'SUPER_ADMIN' })).toBe(true);
    expect(canAccessAdminStudentList({ id: 'campus-admin', role: 'CAMPUS_ADMIN', campusIds: ['campus-east'] })).toBe(true);
    expect(canAccessAdminStudentList({ id: 'teacher', role: 'TEACHER', teacherAssignments: [{ campusId: 'campus-east' }] })).toBe(false);
    expect(canAccessAdminStudentList({ id: 'guardian', role: 'GUARDIAN', guardianStudentIds: ['student-east'] })).toBe(false);
  });

  it('filters students by campus scope and masks identity numbers', () => {
    const items = getAdminStudentListItems({ id: 'campus-admin', role: 'CAMPUS_ADMIN', campusIds: ['campus-east'] }, students);

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(
      expect.objectContaining({
        id: 'student-east',
        identityNumberMasked: '3101********3218',
        campusName: '东城托管中心',
        className: '三年级晚辅 A 班',
        serviceType: '晚辅导',
        status: 'ACTIVE',
      }),
    );
  });

  it('renders campus, class, custody type, status and masked identity number', () => {
    render(<AdminStudentList actor={{ id: 'super-admin', role: 'SUPER_ADMIN' }} students={students} />);

    expect(screen.getByRole('heading', { name: '学生档案' })).toBeInTheDocument();
    expect(screen.getByText('王小明')).toBeInTheDocument();
    expect(screen.getByText('3101********3218')).toBeInTheDocument();
    expect(screen.getByText('东城托管中心')).toBeInTheDocument();
    expect(screen.getByText('三年级晚辅 A 班')).toBeInTheDocument();
    expect(screen.getByText('晚辅导')).toBeInTheDocument();
    expect(screen.getByText('在读')).toBeInTheDocument();
  });

  it('does not render full list content for teacher or guardian actors', () => {
    render(<AdminStudentList actor={{ id: 'teacher', role: 'TEACHER', teacherAssignments: [{ campusId: 'campus-east' }] }} students={students} />);

    expect(screen.getByText('无权访问管理端学生全量列表')).toBeInTheDocument();
    expect(screen.queryByText('王小明')).not.toBeInTheDocument();
  });
});
