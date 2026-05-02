import {
  getAdminClassSettlements,
  type AdminClassSettlementFilters,
  type AdminClassSettlementRow,
} from '@/domain/admin/class-settlements';
import { canViewFinancials, type PermissionActor } from '@/domain/auth/permissions';
import type { ServiceType } from '@/domain/shared/enums';

export type AdminClassSettlementQueryEntities = {
  campusId?: string;
  classId?: string;
  serviceType?: ServiceType;
  settlementDate?: string;
  teacherUserId?: string;
};

export type AdminClassSettlementAiQueryResultItem = {
  settlementId: string;
  campusId: string;
  campusName: string;
  classId: string;
  className: string;
  serviceType: ServiceType;
  settlementDate: string;
  teacherNames: string;
  attendanceSummary: string;
  studentRevenueAmount: number;
  studentRevenueAmountLabel: string;
  teacherFeeAmount: number;
  teacherFeeAmountLabel: string;
  reservedCostAmount: number;
  reservedCostAmountLabel: string;
  estimatedGrossProfitAmount: number;
  estimatedGrossProfitAmountLabel: string;
};

export type AdminClassSettlementAiQueryResult = {
  intent: 'queryClassSettlement';
  risk: 'LOW';
  results: AdminClassSettlementAiQueryResultItem[];
};

export type AdminClassSettlementAiQueryInput = {
  actor: PermissionActor;
  settlements: readonly AdminClassSettlementRow[];
  entities?: AdminClassSettlementQueryEntities;
};

export function queryAdminClassSettlementsForAi(
  input: AdminClassSettlementAiQueryInput,
): AdminClassSettlementAiQueryResult {
  if (!canViewFinancials(input.actor)) {
    throw new Error('无权通过 AI 查询班级核算和毛利');
  }

  const rows = getAdminClassSettlements(input.actor, input.settlements, toSettlementFilters(input.entities));

  return {
    intent: 'queryClassSettlement',
    risk: 'LOW',
    results: rows.map((row) => ({
      settlementId: row.id,
      campusId: row.campusId,
      campusName: row.campusName,
      classId: row.classId,
      className: row.className,
      serviceType: row.serviceType,
      settlementDate: row.settlementDateLabel,
      teacherNames: row.teacherNamesLabel,
      attendanceSummary: row.attendanceSummaryLabel,
      studentRevenueAmount: row.studentRevenueAmount,
      studentRevenueAmountLabel: row.studentRevenueAmountLabel,
      teacherFeeAmount: row.teacherFeeAmount,
      teacherFeeAmountLabel: row.teacherFeeAmountLabel,
      reservedCostAmount: row.reservedCostAmount,
      reservedCostAmountLabel: row.reservedCostAmountLabel,
      estimatedGrossProfitAmount: row.estimatedGrossProfitAmount,
      estimatedGrossProfitAmountLabel: row.estimatedGrossProfitAmountLabel,
    })),
  };
}

function toSettlementFilters(entities: AdminClassSettlementQueryEntities = {}): AdminClassSettlementFilters {
  return {
    campusId: entities.campusId,
    classId: entities.classId,
    serviceType: entities.serviceType,
    date: entities.settlementDate,
    teacherUserId: entities.teacherUserId,
  };
}
