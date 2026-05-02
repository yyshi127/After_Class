import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminAiActionLogs } from '@/components/admin/admin-ai-action-logs';
import { AdminBillingRecords } from '@/components/admin/admin-billing-records';
import { AdminCampusList } from '@/components/admin/admin-campus-list';
import { AdminClassList } from '@/components/admin/admin-class-list';
import { AdminStudentList } from '@/components/admin/admin-student-list';
import type { PermissionActor } from '@/domain/auth/permissions';

const admin: PermissionActor = { id: 'super-admin', role: 'SUPER_ADMIN' };

const campus = {
  id: 'campus-east',
  name: '东城托管中心',
  address: '东城区',
  phone: '010-1',
  principalName: '陈校长',
  status: 'ACTIVE' as const,
};

const student = {
  id: 'student-1',
  name: '王小明',
  identityNumber: '310101201601013218',
  school: '东城一小',
  grade: '三年级',
  campusId: 'campus-east',
  campusName: '东城托管中心',
  classId: 'class-1',
  className: '三年级晚辅 A 班',
  serviceType: '晚辅导' as const,
  status: 'ACTIVE' as const,
  safetyNote: '接送需核验家长手机号',
};

const custodyClass = {
  id: 'class-1',
  name: '三年级晚辅 A 班',
  campusId: 'campus-east',
  campusName: '东城托管中心',
  grade: '三年级',
  capacity: 24,
  teacherNames: ['李老师'],
  studentCount: 18,
  expectedTodayCount: 16,
};

const billingRecord = {
  id: 'billing-1',
  campusId: 'campus-east',
  campusName: '东城托管中心',
  classId: 'class-1',
  className: '三年级晚辅 A 班',
  studentId: 'student-1',
  studentName: '王小明',
  serviceType: '晚辅导' as const,
  billingCycle: 'MONTHLY' as const,
  periodStart: new Date('2026-05-01T00:00:00.000Z'),
  periodEnd: new Date('2026-05-31T00:00:00.000Z'),
  validUntil: new Date('2026-05-31T00:00:00.000Z'),
  amountDue: 1800,
  amountPaid: 1800,
  balanceAmount: 0,
  debtAmount: 0,
};

const aiLog = {
  id: 'log-1',
  campusId: 'campus-east',
  campusName: '东城托管中心',
  campusLabel: '东城托管中心',
  actorUserId: 'guardian-1',
  actorName: '王小明家长',
  actorRole: 'GUARDIAN' as const,
  actorLabel: '王小明家长（家长）',
  rawInput: '今天孩子到托了吗？',
  intent: 'queryAttendance' as const,
  intentLabel: '考勤查询',
  confidence: 0.92,
  confidenceLabel: '92%',
  risk: 'LOW' as const,
  riskLabel: '低风险',
  confirmationRequired: false,
  confirmedAt: null,
  confirmationStatusLabel: '无需确认',
  resultStatus: 'EXECUTED' as const,
  resultStatusLabel: '已执行',
  resultSummary: '返回绑定孩子到托状态',
  failureReason: null,
  createdAt: new Date('2026-05-03T10:00:00.000Z'),
  createdAtLabel: '2026-05-03',
};

describe('admin data management UI', () => {
  it('uses consistent table regions for campus, student, class, billing and AI log management pages', () => {
    const { rerender } = render(<AdminCampusList campuses={[campus]} filters={{ keyword: '', status: 'ALL' }} />);
    expect(screen.getByRole('region', { name: '校区资料表格' })).toBeInTheDocument();
    expect(screen.getByText('共 1 条校区资料')).toBeInTheDocument();

    rerender(<AdminStudentList actor={admin} students={[student]} />);
    expect(screen.getByRole('region', { name: '学生资料表格' })).toBeInTheDocument();
    expect(screen.getByText('共 1 条学生资料')).toBeInTheDocument();

    rerender(<AdminClassList actor={admin} classes={[custodyClass]} />);
    expect(screen.getByRole('region', { name: '班级资料表格' })).toBeInTheDocument();
    expect(screen.getByText('共 1 条班级资料')).toBeInTheDocument();

    rerender(<AdminBillingRecords actor={admin} records={[billingRecord]} />);
    expect(screen.getByRole('region', { name: '收费资料表格' })).toBeInTheDocument();
    expect(screen.getByText('共 1 条收费资料')).toBeInTheDocument();

    rerender(<AdminAiActionLogs logs={[aiLog]} />);
    expect(screen.getByRole('region', { name: '日志资料表格' })).toBeInTheDocument();
    expect(screen.getByText('共 1 条日志资料')).toBeInTheDocument();
  });

  it('renders loading, empty and error states with explicit accessible status text', () => {
    const { rerender } = render(<AdminCampusList campuses={[]} filters={{ keyword: '', status: 'ALL' }} isLoading />);
    expect(screen.getByRole('status', { name: '校区资料加载中' })).toHaveTextContent('正在加载校区资料');

    rerender(<AdminCampusList campuses={[]} filters={{ keyword: '', status: 'ALL' }} />);
    expect(screen.getByRole('status', { name: '校区资料空状态' })).toHaveTextContent('暂无符合条件的校区');

    rerender(<AdminCampusList campuses={[]} filters={{ keyword: '', status: 'ALL' }} errorMessage="校区资料加载失败，请稍后重试" />);
    expect(screen.getByRole('alert')).toHaveTextContent('校区资料加载失败，请稍后重试');
  });
});
