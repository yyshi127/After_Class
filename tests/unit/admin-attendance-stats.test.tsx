import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminAttendanceStats } from '@/components/admin/admin-attendance-stats';
import { getAdminAttendanceStats } from '@/domain/admin/attendance-stats';

const attendanceRows = [
  {
    studentId: 'student-east-1',
    studentName: '王小明',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g3',
    className: '三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: '已到' as const,
  },
  {
    studentId: 'student-east-2',
    studentName: '李小红',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g3',
    className: '三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: '迟到' as const,
  },
  {
    studentId: 'student-east-3',
    studentName: '赵小刚',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g3',
    className: '三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: '请假' as const,
  },
  {
    studentId: 'student-east-4',
    studentName: '周小云',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g4',
    className: '四年级晚托 B 班',
    serviceType: '晚全托' as const,
    status: '缺勤' as const,
  },
  {
    studentId: 'student-west-1',
    studentName: '钱小西',
    campusId: 'campus-west',
    campusName: '西城托管中心',
    classId: 'class-west-g3',
    className: '西城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: '已到' as const,
  },
];

describe('admin attendance stats', () => {
  it('summarizes expected, arrived, leave and absent counts by campus, class and service type', () => {
    const stats = getAdminAttendanceStats({ id: 'super-admin', role: 'SUPER_ADMIN' }, attendanceRows);

    expect(stats).toEqual([
      expect.objectContaining({
        campusId: 'campus-east',
        campusName: '东城托管中心',
        classId: 'class-east-g3',
        className: '三年级晚辅 A 班',
        serviceType: '晚辅导',
        expectedCount: 3,
        arrivedCount: 2,
        leaveCount: 1,
        absentCount: 0,
        attendanceRateLabel: '66.67%',
      }),
      expect.objectContaining({
        campusId: 'campus-east',
        classId: 'class-east-g4',
        serviceType: '晚全托',
        expectedCount: 1,
        arrivedCount: 0,
        leaveCount: 0,
        absentCount: 1,
        attendanceRateLabel: '0.00%',
      }),
      expect.objectContaining({
        campusId: 'campus-west',
        classId: 'class-west-g3',
        expectedCount: 1,
        arrivedCount: 1,
      }),
    ]);
  });

  it('filters out other campuses for campus admins', () => {
    const stats = getAdminAttendanceStats(
      { id: 'east-admin', role: 'CAMPUS_ADMIN', campusIds: ['campus-east'] },
      attendanceRows,
    );

    expect(stats).toHaveLength(2);
    expect(stats.every((item) => item.campusId === 'campus-east')).toBe(true);
    expect(stats.map((item) => item.campusName)).not.toContain('西城托管中心');
  });

  it('does not expose attendance stats to teacher or guardian roles', () => {
    expect(
      getAdminAttendanceStats(
        { id: 'teacher', role: 'TEACHER', teacherAssignments: [{ campusId: 'campus-east' }] },
        attendanceRows,
      ),
    ).toEqual([]);
    expect(
      getAdminAttendanceStats(
        { id: 'guardian', role: 'GUARDIAN', guardianStudentIds: ['student-east-1'] },
        attendanceRows,
      ),
    ).toEqual([]);
  });

  it('renders grouped attendance stats table', () => {
    render(<AdminAttendanceStats actor={{ id: 'super-admin', role: 'SUPER_ADMIN' }} rows={attendanceRows} />);

    expect(screen.getByRole('heading', { name: '考勤统计' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '应到' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '实到' })).toBeInTheDocument();
    expect(screen.getByText('三年级晚辅 A 班')).toBeInTheDocument();
    expect(screen.getByText('晚全托')).toBeInTheDocument();
    expect(screen.getByText('66.67%')).toBeInTheDocument();
  });
});
