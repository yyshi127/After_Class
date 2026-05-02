import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminAiActionLogs } from '@/components/admin/admin-ai-action-logs';
import { getAdminAiActionLogs } from '@/domain/admin/ai-action-logs';
import type { PermissionActor } from '@/domain/auth/permissions';

const superAdmin: PermissionActor = { id: 'super-admin', role: 'SUPER_ADMIN', campusIds: [] };
const eastCampusAdmin: PermissionActor = { id: 'east-admin', role: 'CAMPUS_ADMIN', campusIds: ['campus-east'] };
const teacher: PermissionActor = {
  id: 'teacher-1',
  role: 'TEACHER',
  teacherAssignments: [{ campusId: 'campus-east', classId: 'class-1' }],
};

const logs = [
  {
    id: 'log-1',
    campusId: 'campus-east',
    campusName: '东城校区',
    actorUserId: 'guardian-1',
    actorName: '王小明家长',
    actorRole: 'GUARDIAN' as const,
    rawInput: '今天孩子到托了吗？',
    intent: 'queryAttendance' as const,
    confidence: 0.92,
    risk: 'LOW' as const,
    confirmationRequired: false,
    confirmedAt: null,
    resultStatus: 'EXECUTED' as const,
    resultSummary: '返回绑定孩子到托状态',
    failureReason: null,
    createdAt: new Date('2026-05-03T10:00:00.000Z'),
  },
  {
    id: 'log-2',
    campusId: 'campus-west',
    campusName: '西城校区',
    actorUserId: 'admin-west',
    actorName: '西城管理员',
    actorRole: 'CAMPUS_ADMIN' as const,
    rawInput: '把欠费改成 0',
    intent: 'queryBilling' as const,
    confidence: 0.99,
    risk: 'HIGH' as const,
    confirmationRequired: false,
    confirmedAt: null,
    resultStatus: 'REJECTED' as const,
    resultSummary: 'AI 已拒绝执行高风险操作',
    failureReason: '高风险动作禁止由 AI 执行',
    createdAt: new Date('2026-05-03T11:00:00.000Z'),
  },
];

describe('admin AI action logs', () => {
  it('filters AI logs by campus, user, intent, risk, confirmation status, result and date for admins', () => {
    const visible = getAdminAiActionLogs(superAdmin, logs, {
      campusId: 'campus-west',
      userKeyword: '西城',
      intent: 'queryBilling',
      risk: 'HIGH',
      confirmationStatus: 'NOT_REQUIRED',
      resultStatus: 'REJECTED',
      date: '2026-05-03',
    });

    expect(visible).toHaveLength(1);
    expect(visible[0]).toMatchObject({
      id: 'log-2',
      campusName: '西城校区',
      actorLabel: '西城管理员（校区管理员）',
      intentLabel: '服务有效期/收费查询',
      riskLabel: '高风险',
      confirmationStatusLabel: '无需确认',
      resultStatusLabel: '已拒绝',
      createdAtLabel: '2026-05-03',
    });
  });

  it('limits campus admins to authorized campus logs and denies non-admin roles', () => {
    expect(getAdminAiActionLogs(eastCampusAdmin, logs, {})).toHaveLength(1);
    expect(getAdminAiActionLogs(eastCampusAdmin, logs, {})[0].campusName).toBe('东城校区');
    expect(getAdminAiActionLogs(teacher, logs, {})).toEqual([]);
  });

  it('renders the AI operation log page without leaking hidden campus logs', () => {
    const visibleLogs = getAdminAiActionLogs(eastCampusAdmin, logs, {});

    render(<AdminAiActionLogs logs={visibleLogs} />);

    expect(screen.getByRole('heading', { name: 'AI 操作日志' })).toBeInTheDocument();
    expect(screen.getByLabelText('时间筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('用户筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('意图筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('风险筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('确认状态筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('结果筛选')).toBeInTheDocument();

    const row = screen.getByRole('row', { name: /王小明家长/ });
    expect(within(row).getByText('考勤查询')).toBeInTheDocument();
    expect(within(row).getByText('低风险')).toBeInTheDocument();
    expect(within(row).getByText('无需确认')).toBeInTheDocument();
    expect(within(row).getByText('已执行')).toBeInTheDocument();
    expect(screen.queryByText('西城管理员')).not.toBeInTheDocument();
  });
});
