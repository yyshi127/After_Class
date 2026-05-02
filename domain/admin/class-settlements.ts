import { canAccessCampus, type PermissionActor } from '@/domain/auth/permissions';
import type { ServiceType } from '@/domain/shared/enums';

export type AdminClassSettlementRow = {
  id: string;
  campusId: string;
  campusName: string;
  classId: string;
  className: string;
  serviceType: ServiceType;
  teacherUserIds: readonly string[];
  teacherNames: readonly string[];
  settlementDate: Date;
  expectedCount: number;
  arrivedCount: number;
  leaveCount: number;
  absentCount: number;
  pendingCount: number;
  studentRevenueAmount: number;
  teacherFeeAmount: number;
  reservedCostAmount: number;
  estimatedGrossProfitAmount: number;
};

export type AdminClassSettlementFilters = {
  campusId?: string;
  date?: string;
  classId?: string;
  serviceType?: ServiceType;
  teacherUserId?: string;
};

export type AdminClassSettlementListItem = AdminClassSettlementRow & {
  settlementDateLabel: string;
  teacherNamesLabel: string;
  attendanceSummaryLabel: string;
  studentRevenueAmountLabel: string;
  teacherFeeAmountLabel: string;
  reservedCostAmountLabel: string;
  estimatedGrossProfitAmountLabel: string;
};

function canAccessAdminClassSettlements(actor: PermissionActor): boolean {
  return actor.role === 'SUPER_ADMIN' || actor.role === 'ADMIN' || actor.role === 'CAMPUS_ADMIN';
}

export function getAdminClassSettlements(
  actor: PermissionActor,
  settlements: readonly AdminClassSettlementRow[],
  filters: AdminClassSettlementFilters = {},
): AdminClassSettlementListItem[] {
  if (!canAccessAdminClassSettlements(actor)) {
    return [];
  }

  return settlements
    .filter((settlement) => canAccessCampus(actor, settlement.campusId))
    .filter((settlement) => !filters.campusId || settlement.campusId === filters.campusId)
    .filter((settlement) => !filters.date || formatDate(settlement.settlementDate) === filters.date)
    .filter((settlement) => !filters.classId || settlement.classId === filters.classId)
    .filter((settlement) => !filters.serviceType || settlement.serviceType === filters.serviceType)
    .filter((settlement) => !filters.teacherUserId || settlement.teacherUserIds.includes(filters.teacherUserId))
    .map((settlement) => ({
      ...settlement,
      settlementDateLabel: formatDate(settlement.settlementDate),
      teacherNamesLabel: settlement.teacherNames.join('、'),
      attendanceSummaryLabel: `应到 ${settlement.expectedCount} / 到课 ${settlement.arrivedCount} / 请假 ${settlement.leaveCount} / 缺勤 ${settlement.absentCount} / 待确认 ${settlement.pendingCount}`,
      studentRevenueAmountLabel: formatCurrency(settlement.studentRevenueAmount),
      teacherFeeAmountLabel: formatCurrency(settlement.teacherFeeAmount),
      reservedCostAmountLabel: formatCurrency(settlement.reservedCostAmount),
      estimatedGrossProfitAmountLabel: formatCurrency(settlement.estimatedGrossProfitAmount),
    }))
    .sort((left, right) => {
      const dateCompare = right.settlementDate.getTime() - left.settlementDate.getTime();
      if (dateCompare !== 0) return dateCompare;

      const campusCompare = left.campusName.localeCompare(right.campusName, 'zh-Hans-CN');
      if (campusCompare !== 0) return campusCompare;

      return left.className.localeCompare(right.className, 'zh-Hans-CN');
    });
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatCurrency(amount: number): string {
  const prefix = amount < 0 ? '-¥' : '¥';
  return `${prefix}${Math.abs(amount).toFixed(2)}`;
}
