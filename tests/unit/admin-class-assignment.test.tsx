import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminClassAssignmentPanel } from '@/components/admin/admin-class-assignment-panel';
import { canAssignWithinCampusScope, getAssignableClasses } from '@/domain/admin/class-assignment';

const classes = [
  { id: 'class-east-g3', name: '三年级晚辅 A 班', campusId: 'campus-east', campusName: '东城托管中心', capacity: 2 },
  { id: 'class-west-g4', name: '四年级晚托 B 班', campusId: 'campus-west', campusName: '西城托管中心', capacity: 20 },
];

const teachers = [
  { id: 'teacher-east', name: '李老师', campusIds: ['campus-east'] },
  { id: 'teacher-west', name: '王老师', campusIds: ['campus-west'] },
];

const students = [
  { id: 'student-east-1', name: '王小明', campusId: 'campus-east', classId: 'class-east-g3' },
  { id: 'student-east-2', name: '刘小光', campusId: 'campus-east', classId: null },
  { id: 'student-west-1', name: '李小红', campusId: 'campus-west', classId: null },
];

describe('admin class assignment', () => {
  it('allows assignment only inside authorized campus scope', () => {
    const actor = { id: 'campus-admin', role: 'CAMPUS_ADMIN' as const, campusIds: ['campus-east'] };

    expect(canAssignWithinCampusScope(actor, { campusId: 'campus-east' }, { campusIds: ['campus-east'] }, [{ campusId: 'campus-east' }])).toBe(true);
    expect(canAssignWithinCampusScope(actor, { campusId: 'campus-west' }, { campusIds: ['campus-west'] }, [{ campusId: 'campus-west' }])).toBe(false);
    expect(canAssignWithinCampusScope(actor, { campusId: 'campus-east' }, { campusIds: ['campus-west'] }, [{ campusId: 'campus-east' }])).toBe(false);
  });

  it('filters assignable classes by campus and shows capacity hint', () => {
    const items = getAssignableClasses({ id: 'campus-admin', role: 'CAMPUS_ADMIN', campusIds: ['campus-east'] }, classes, students);

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(expect.objectContaining({ id: 'class-east-g3', capacityHint: '已分配 1/2，可继续分配' }));
  });

  it('renders teacher and student assignment controls', () => {
    render(
      <AdminClassAssignmentPanel
        actor={{ id: 'campus-admin', role: 'CAMPUS_ADMIN', campusIds: ['campus-east'] }}
        classes={classes}
        teachers={teachers}
        students={students}
      />,
    );

    expect(screen.getByRole('heading', { name: '班级分配老师和学生' })).toBeInTheDocument();
    expect(screen.getByLabelText('选择班级')).toBeInTheDocument();
    expect(screen.getByLabelText('选择老师')).toBeInTheDocument();
    expect(screen.getByLabelText('选择学生')).toBeInTheDocument();
    expect(screen.getByText('已分配 1/2，可继续分配')).toBeInTheDocument();
    expect(screen.queryByText('四年级晚托 B 班')).not.toBeInTheDocument();
  });
});
