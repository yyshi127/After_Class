import { AdminAiActionLogs } from '@/components/admin/admin-ai-action-logs';
import { AdminLayout } from '@/components/admin/admin-layout';
import { getAdminAiActionLogs, type AdminAiActionLogRow } from '@/domain/admin/ai-action-logs';
import { DEMO_SEED } from '@/prisma/seed-data';

const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

const demoAiLogs: readonly AdminAiActionLogRow[] = [
  {
    id: 'demo-ai-log-attendance',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    actorUserId: 'demo-guardian-wang',
    actorName: '王小明家长',
    actorRole: 'GUARDIAN',
    rawInput: '今天孩子到托了吗？',
    intent: 'queryAttendance',
    confidence: 0.92,
    risk: 'LOW',
    confirmationRequired: false,
    confirmedAt: null,
    resultStatus: 'EXECUTED',
    resultSummary: '返回绑定孩子到托状态和照片入口',
    failureReason: null,
    createdAt: new Date('2026-05-03T10:00:00.000Z'),
  },
  {
    id: 'demo-ai-log-leave',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    actorUserId: 'demo-guardian-wang',
    actorName: '王小明家长',
    actorRole: 'GUARDIAN',
    rawInput: '明天晚辅导请假，孩子发烧',
    intent: 'createLeaveRequest',
    confidence: 0.88,
    risk: 'MEDIUM',
    confirmationRequired: true,
    confirmedAt: null,
    resultStatus: 'CONFIRMATION_REQUIRED',
    resultSummary: '已生成请假确认卡片，等待家长确认',
    failureReason: null,
    createdAt: new Date('2026-05-03T10:30:00.000Z'),
  },
  {
    id: 'demo-ai-log-high-risk',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    actorUserId: 'demo-campus-admin-east',
    actorName: '东城校区管理员',
    actorRole: 'CAMPUS_ADMIN',
    rawInput: '把欠费改成 0',
    intent: 'queryBilling',
    confidence: 0.99,
    risk: 'HIGH',
    confirmationRequired: false,
    confirmedAt: null,
    resultStatus: 'REJECTED',
    resultSummary: 'AI 已拒绝执行高风险操作',
    failureReason: '高风险动作禁止由 AI 执行，请转到传统页面并由有权限人员人工复核',
    createdAt: new Date('2026-05-03T11:00:00.000Z'),
  },
  {
    id: 'demo-ai-log-west-hidden',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    actorUserId: 'demo-campus-admin-west',
    actorName: '西城校区管理员',
    actorRole: 'CAMPUS_ADMIN',
    rawInput: '查询西城毛利',
    intent: 'queryClassSettlement',
    confidence: 0.9,
    risk: 'LOW',
    confirmationRequired: false,
    confirmedAt: null,
    resultStatus: 'EXECUTED',
    resultSummary: '返回西城班级核算',
    failureReason: null,
    createdAt: new Date('2026-05-03T12:00:00.000Z'),
  },
];

export default function AdminAiLogsPage() {
  const visibleLogs = getAdminAiActionLogs(actor, demoAiLogs, {});

  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminAiActionLogs logs={visibleLogs} />
    </AdminLayout>
  );
}
