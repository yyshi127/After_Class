import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminClassList } from '@/components/admin/admin-class-list';
import { getAdminClassListItems } from '@/domain/admin/class-list';

const classes = [
  {
    id: 'class-east-g3',
    name: '三年级晚辅 A 班',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    grade: '三年级',
    capacity: 24,
    teacherNames: ['李老师', '周助教'],
    studentCount: 18,
    expectedTodayCount: 16,
  },
  {
    id: 'class-west-g4',
    name: '四年级晚托 B 班',
    campusId: 'campus-west',
    campusName: '西城托管中心',
    grade: '四年级',
    capacity: 20,
    teacherNames: ['王老师'],
    studentCount: 12,
    expectedTodayCount: 11,
  },
];

describe('admin class list', () => {
  it('filters classes by campus scope for campus admins', () => {
    const items = getAdminClassListItems({ id: 'campus-admin', role: 'CAMPUS_ADMIN', campusIds: ['campus-east'] }, classes);

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(
      expect.objectContaining({
        id: 'class-east-g3',
        campusName: '东城托管中心',
        teacherSummary: '李老师、周助教',
        capacitySummary: '18/24',
        expectedTodayCount: 16,
      }),
    );
  });

  it('does not expose admin class list to teacher or guardian roles', () => {
    expect(getAdminClassListItems({ id: 'teacher', role: 'TEACHER', teacherAssignments: [{ campusId: 'campus-east' }] }, classes)).toEqual([]);
    expect(getAdminClassListItems({ id: 'guardian', role: 'GUARDIAN', guardianStudentIds: ['student-east'] }, classes)).toEqual([]);
  });

  it('renders class, campus, teachers, capacity, student count and expected attendance', () => {
    render(<AdminClassList actor={{ id: 'super-admin', role: 'SUPER_ADMIN' }} classes={classes} />);

    expect(screen.getByRole('heading', { name: '班级管理' })).toBeInTheDocument();
    expect(screen.getByText('三年级晚辅 A 班')).toBeInTheDocument();
    expect(screen.getByText('东城托管中心')).toBeInTheDocument();
    expect(screen.getByText('李老师、周助教')).toBeInTheDocument();
    expect(screen.getByText('18/24')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
  });
});
