import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ParentHomeSafetyCard } from '@/components/parent/parent-home-safety-card';
import { getParentSafetyArrivalCards } from '@/domain/parent/safety-arrival';

const guardianActor = {
  id: 'demo-guardian-wang',
  role: 'GUARDIAN' as const,
  guardianStudentIds: ['demo-student-profile-wang'],
};

const attendanceRecords = [
  {
    id: 'attendance-wang-arrived',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
    studentId: 'demo-student-profile-wang',
    teacherUserId: 'demo-teacher-li',
    serviceType: '晚辅导' as const,
    status: '已到' as const,
    checkedAt: new Date('2026-05-02T10:30:00.000Z'),
    photoFileId: 'file-arrival-photo-wang',
    matchStatus: 'MATCHED' as const,
    notificationStatus: 'SENT' as const,
  },
  {
    id: 'attendance-li-arrived',
    campusId: 'demo-campus-west',
    classId: 'demo-class-west-g4',
    studentId: 'other-student-profile-li',
    teacherUserId: 'demo-teacher-zhao',
    serviceType: '晚辅导' as const,
    status: '已到' as const,
    checkedAt: new Date('2026-05-02T10:35:00.000Z'),
    photoFileId: 'file-arrival-photo-li',
    matchStatus: 'MATCHED' as const,
    notificationStatus: 'SENT' as const,
  },
];

const students = [
  {
    id: 'demo-student-profile-wang',
    name: '王小明',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
  },
  {
    id: 'other-student-profile-li',
    name: '李小红',
    campusId: 'demo-campus-west',
    classId: 'demo-class-west-g4',
  },
];

const teachers = [
  { id: 'demo-teacher-li', name: '李老师' },
  { id: 'demo-teacher-zhao', name: '赵老师' },
];

describe('parent home safety arrival card', () => {
  it('returns only bound children arrival cards for a guardian', () => {
    const cards = getParentSafetyArrivalCards({
      actor: guardianActor,
      attendanceRecords,
      students,
      teachers,
    });

    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({
      studentName: '王小明',
      status: '已到',
      serviceType: '晚辅导',
      teacherName: '李老师',
      photoFileId: 'file-arrival-photo-wang',
    });
    expect(cards.map((card) => card.studentName)).not.toContain('李小红');
  });

  it('renders child status, arrival time, service type, teacher and photo reference', () => {
    const cards = getParentSafetyArrivalCards({
      actor: guardianActor,
      attendanceRecords,
      students,
      teachers,
    });

    render(<ParentHomeSafetyCard cards={cards} />);

    expect(screen.getByRole('heading', { name: '安全到达' })).toBeVisible();
    expect(screen.getByText('王小明')).toBeVisible();
    expect(screen.getByText('已到')).toBeVisible();
    expect(screen.getByText('晚辅导')).toBeVisible();
    expect(screen.getByText('李老师')).toBeVisible();
    expect(screen.getByText('到托时间：18:30')).toBeVisible();
    expect(screen.getByText('照片：file-arrival-photo-wang')).toBeVisible();
    expect(screen.queryByText('李小红')).not.toBeInTheDocument();
  });
});
