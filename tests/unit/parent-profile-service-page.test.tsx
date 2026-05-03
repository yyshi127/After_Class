import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ParentProfileServicePage } from '@/components/parent/parent-profile-service-page';
import { getParentProfileStudents } from '@/domain/parent/profile';

const guardian = {
  id: 'demo-guardian-wang',
  role: 'GUARDIAN' as const,
  guardianStudentIds: ['demo-student-profile-wang'],
};

const students = [
  {
    id: 'demo-student-profile-wang',
    name: '王小明',
    identityNumber: '310101201001013218',
    school: '育才小学',
    grade: '三年级',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
    serviceType: '晚辅导' as const,
    safetyNote: '放学后需家长本人接送。',
  },
  {
    id: 'other-student',
    name: '其他学生',
    identityNumber: '310101201101019999',
    school: '其他小学',
    grade: '四年级',
    campusId: 'demo-campus-west',
    classId: 'demo-class-west-g4',
    serviceType: '晚托管' as never,
  },
];

const guardianBindings = [
  {
    guardianUserId: 'demo-guardian-wang',
    studentId: 'demo-student-profile-wang',
    relationship: '母亲',
    phone: '13800000004',
    notifyEnabled: true,
  },
];

const serviceValidities = [
  {
    studentId: 'demo-student-profile-wang',
    studentName: '王小明',
    serviceType: '晚辅导',
    validUntil: new Date('2026-05-31T23:59:59.000Z'),
    statusLabel: '当前服务有效期至 2026-05-31',
  },
];

describe('parent profile service page', () => {
  it('projects bound children with masked identity number, notification, leave records and safe service validity', () => {
    const profiles = getParentProfileStudents({
      guardian,
      students,
      guardianBindings,
      serviceValidities,
      leaveRecords: [
        {
          id: 'leave-wang-20260504',
          studentId: 'demo-student-profile-wang',
          leaveDate: '2026-05-04',
          serviceType: '晚辅导',
          reason: '孩子发烧',
          status: '已确认',
        },
      ],
    });

    expect(profiles).toHaveLength(1);
    expect(profiles[0]).toMatchObject({
      name: '王小明',
      identityNumberMasked: '3101********3218',
      relationship: '母亲',
      notifyEnabled: true,
      serviceValidityLabel: '有效至 2026-05-31',
    });
    expect(JSON.stringify(profiles)).not.toMatch(/310101201001013218|amountDue|amountPaid|balanceAmount|debtAmount|欠费|余额/);
  });

  it('renders parent profile without full identity number or financial fields', () => {
    const profiles = getParentProfileStudents({
      guardian,
      students,
      guardianBindings,
      serviceValidities,
      leaveRecords: [
        {
          id: 'leave-wang-20260504',
          studentId: 'demo-student-profile-wang',
          leaveDate: '2026-05-04',
          serviceType: '晚辅导',
          reason: '孩子发烧',
          status: '已确认',
        },
      ],
    });

    render(<ParentProfileServicePage profiles={profiles} />);

    expect(screen.getByRole('region', { name: '家长我的服务' })).toBeInTheDocument();
    expect(screen.getByText('王小明')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '王小明孩子信息' })).toHaveTextContent('3101********3218');
    expect(screen.getByRole('region', { name: '王小明通知设置' })).toHaveTextContent('到托/离校通知：已开启');
    expect(screen.getByRole('region', { name: '王小明请假记录' })).toHaveTextContent('2026-05-04 · 晚辅导 · 已确认');
    expect(screen.getByText('有效至 2026-05-31')).toBeInTheDocument();
    expect(screen.queryByText(/310101201001013218|欠费|余额|应收|已收|课消|教师费用|毛利/)).not.toBeInTheDocument();
  });
});
