import { canAccessCampus, type PermissionActor } from '@/domain/auth/permissions';
import type { AiActionResultStatus } from '@/domain/ai-command/ai-action-log';
import type { AiIntent, RiskLevel, Role } from '@/domain/shared/enums';

export type AiActionLogConfirmationStatusFilter = 'REQUIRED' | 'NOT_REQUIRED' | 'CONFIRMED';

export type AdminAiActionLogRow = {
  id: string;
  campusId: string | null;
  campusName: string | null;
  actorUserId: string;
  actorName: string;
  actorRole: Role;
  rawInput: string;
  intent: AiIntent | null;
  confidence: number;
  risk: RiskLevel;
  confirmationRequired: boolean;
  confirmedAt: Date | null;
  resultStatus: AiActionResultStatus;
  resultSummary: string | null;
  failureReason: string | null;
  createdAt: Date;
};

export type AdminAiActionLogFilters = {
  campusId?: string;
  date?: string;
  userKeyword?: string;
  intent?: AiIntent;
  risk?: RiskLevel;
  confirmationStatus?: AiActionLogConfirmationStatusFilter;
  resultStatus?: AiActionResultStatus;
};

export type AdminAiActionLogListItem = AdminAiActionLogRow & {
  createdAtLabel: string;
  actorLabel: string;
  intentLabel: string;
  riskLabel: string;
  confirmationStatusLabel: string;
  resultStatusLabel: string;
  confidenceLabel: string;
  campusLabel: string;
};

function canViewAiActionLogs(actor: PermissionActor): boolean {
  return actor.role === 'SUPER_ADMIN' || actor.role === 'ADMIN' || actor.role === 'CAMPUS_ADMIN';
}

export function getAdminAiActionLogs(
  actor: PermissionActor,
  logs: readonly AdminAiActionLogRow[],
  filters: AdminAiActionLogFilters = {},
): AdminAiActionLogListItem[] {
  if (!canViewAiActionLogs(actor)) {
    return [];
  }

  const normalizedUserKeyword = filters.userKeyword?.trim().toLowerCase();

  return logs
    .filter((log) => !log.campusId || canAccessCampus(actor, log.campusId))
    .filter((log) => !filters.campusId || log.campusId === filters.campusId)
    .filter((log) => !filters.date || formatDate(log.createdAt) === filters.date)
    .filter((log) => !normalizedUserKeyword || `${log.actorName} ${log.actorUserId}`.toLowerCase().includes(normalizedUserKeyword))
    .filter((log) => !filters.intent || log.intent === filters.intent)
    .filter((log) => !filters.risk || log.risk === filters.risk)
    .filter((log) => !filters.resultStatus || log.resultStatus === filters.resultStatus)
    .filter((log) => matchesConfirmationStatus(log, filters.confirmationStatus))
    .map((log) => ({
      ...log,
      createdAtLabel: formatDate(log.createdAt),
      actorLabel: `${log.actorName}（${roleLabels[log.actorRole]}）`,
      intentLabel: log.intent ? intentLabels[log.intent] : '未知意图',
      riskLabel: riskLabels[log.risk],
      confirmationStatusLabel: getConfirmationStatusLabel(log),
      resultStatusLabel: resultStatusLabels[log.resultStatus],
      confidenceLabel: `${Math.round(log.confidence * 100)}%`,
      campusLabel: log.campusName ?? '全局/未绑定校区',
    }))
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

function matchesConfirmationStatus(log: AdminAiActionLogRow, confirmationStatus?: AiActionLogConfirmationStatusFilter): boolean {
  if (!confirmationStatus) return true;
  if (confirmationStatus === 'CONFIRMED') return Boolean(log.confirmedAt);
  if (confirmationStatus === 'REQUIRED') return log.confirmationRequired && !log.confirmedAt;
  return !log.confirmationRequired;
}

function getConfirmationStatusLabel(log: AdminAiActionLogRow): string {
  if (log.confirmedAt) return '已确认';
  if (log.confirmationRequired) return '待确认';
  return '无需确认';
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: '总校长',
  ADMIN: '总部管理员',
  CAMPUS_ADMIN: '校区管理员',
  TEACHER: '老师',
  ASSISTANT: '助教',
  GUARDIAN: '家长',
  STUDENT: '学生',
};

const intentLabels: Record<AiIntent, string> = {
  queryAttendance: '考勤查询',
  queryHomework: '作业查询',
  createLeaveRequest: '请假申请',
  queryBilling: '服务有效期/收费查询',
  sendTeacherMessage: '留言老师',
  recordHomeworkFeedback: '反馈草稿',
  suggestMistakeAreas: '圈错建议',
  generateSimilarQuestions: '同类题生成',
  queryClassSettlement: '班级核算查询',
};

const riskLabels: Record<RiskLevel, string> = {
  LOW: '低风险',
  MEDIUM: '中风险',
  HIGH: '高风险',
};

const resultStatusLabels: Record<AiActionResultStatus, string> = {
  DRAFTED: '已生成草稿',
  CONFIRMATION_REQUIRED: '待确认',
  EXECUTED: '已执行',
  REJECTED: '已拒绝',
  FAILED: '失败',
};
