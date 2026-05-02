import { canAccessCampus, type PermissionActor } from '@/domain/auth/permissions';
import type { BillingRecordForServiceValidity } from '@/domain/billing/service-validity';

export type AdminBillingRecordRow = BillingRecordForServiceValidity & {
  campusName: string;
  classId: string | null;
  className: string;
};

export type AdminBillingRecordListItem = AdminBillingRecordRow & {
  billingCycleLabel: string;
  servicePeriodLabel: string;
  validUntilLabel: string;
  amountDueLabel: string;
  amountPaidLabel: string;
};

function canAccessAdminBillingRecords(actor: PermissionActor): boolean {
  return actor.role === 'SUPER_ADMIN' || actor.role === 'ADMIN' || actor.role === 'CAMPUS_ADMIN';
}

export function getAdminBillingRecords(
  actor: PermissionActor,
  records: readonly AdminBillingRecordRow[],
): AdminBillingRecordListItem[] {
  if (!canAccessAdminBillingRecords(actor)) {
    return [];
  }

  return records
    .filter((record) => canAccessCampus(actor, record.campusId))
    .map((record) => ({
      ...record,
      billingCycleLabel: record.billingCycle === 'MONTHLY' ? '月缴' : '学期缴',
      servicePeriodLabel: `${formatDate(record.periodStart)} 至 ${formatDate(record.periodEnd)}`,
      validUntilLabel: formatDate(record.validUntil),
      amountDueLabel: formatCurrency(record.amountDue),
      amountPaidLabel: formatCurrency(record.amountPaid),
    }))
    .sort((left, right) => {
      const campusCompare = left.campusName.localeCompare(right.campusName, 'zh-Hans-CN');
      if (campusCompare !== 0) return campusCompare;

      const classCompare = left.className.localeCompare(right.className, 'zh-Hans-CN');
      if (classCompare !== 0) return classCompare;

      return left.studentName.localeCompare(right.studentName, 'zh-Hans-CN');
    });
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}
