import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TeacherTodayCustodyPage } from '@/components/teacher/teacher-today-custody-page';
import { getTeacherTodayCustodyItems } from '@/domain/teacher/today-custody';

const custodyRecords = [
  {
    id: 'student-east-1',
    studentName: '王小明',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g3',
    className: '三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    attendanceStatus: '待确认' as const,
    serviceExpiresAt: '2026-05-06',
  },
  {
    id: 'student-east-2',
    studentName: '李小红',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g4',
    className: '四年级晚辅 B 班',
    serviceType: '晚全托' as const,
    attendanceStatus: '已到' as const,
    serviceExpiresAt: '2026-06-30',
  },
  {
    id: 'student-west-1',
    studentName: '赵小西',
    campusId: 'campus-west',
    campusName: '西城托管中心',
    classId: 'class-west-g3',
    className: '西城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    attendanceStatus: '缺勤' as const,
    serviceExpiresAt: '2026-05-20',
  },
];

const teacher = {
  id: 'teacher-li',
  role: 'TEACHER' as const,
  teacherAssignments: [{ campusId: 'campus-east', classId: 'class-east-g3' }],
};

describe('teacher today custody page', () => {
  it('only returns students assigned to the teacher', () => {
    const items = getTeacherTodayCustodyItems({ actor: teacher, records: custodyRecords, today: '2026-05-02' });

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(
      expect.objectContaining({
        id: 'student-east-1',
        studentName: '王小明',
        campusName: '东城托管中心',
        className: '三年级晚辅 A 班',
        statusLabel: '待确认',
        serviceExpiryLabel: '服务 4 天后到期',
      }),
    );
  });

  it('supports campus, class and service type filters inside teacher assignment scope', () => {
    const campusScopedTeacher = {
      id: 'teacher-east',
      role: 'TEACHER' as const,
      teacherAssignments: [{ campusId: 'campus-east' }],
    };

    const items = getTeacherTodayCustodyItems({
      actor: campusScopedTeacher,
      records: custodyRecords,
      filters: { campusId: 'campus-east', classId: 'class-east-g4', serviceType: '晚全托' },
      today: '2026-05-02',
    });

    expect(items).toHaveLength(1);
    expect(items[0].studentName).toBe('李小红');
  });

  it('renders filters, student attendance status and service expiry reminder', () => {
    render(<TeacherTodayCustodyPage actor={teacher} records={custodyRecords} today="2026-05-02" />);

    expect(screen.getByRole('heading', { name: '今日托管' })).toBeInTheDocument();
    expect(screen.getByLabelText('校区筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('班级筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('托管类型筛选')).toBeInTheDocument();
    expect(screen.getByText('王小明')).toBeInTheDocument();
    expect(screen.getByText('待确认')).toBeInTheDocument();
    expect(screen.getByText('服务 4 天后到期')).toBeInTheDocument();
    expect(screen.queryByText('赵小西')).not.toBeInTheDocument();
  });

  it('renders teacher check-in, check-out and responsible campus/class summary', () => {
    render(<TeacherTodayCustodyPage actor={teacher} records={custodyRecords} today="2026-05-02" />);

    expect(screen.getByText('今日负责：东城托管中心 · 三年级晚辅 A 班')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '到岗签到' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '离岗签退' })).toBeInTheDocument();
  });
});
