import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';

export type BillingRecordForServiceValidity = {
  id: string;
  campusId: string;
  studentId: string;
  studentName: string;
  serviceType: string;
  billingCycle: 'MONTHLY' | 'SEMESTER';
  periodStart: Date;
  periodEnd: Date;
  amountDue: number;
  amountPaid: number;
  balanceAmount: number;
  debtAmount: number;
  validUntil: Date;
};

export type ParentVisibleServiceValidity = {
  studentId: string;
  studentName: string;
  serviceType: string;
  validUntil: Date;
  statusLabel: string;
};

export function getGuardianVisibleServiceValidity({
  guardian,
  records,
}: {
  guardian: PermissionActor;
  records: readonly BillingRecordForServiceValidity[];
}): ParentVisibleServiceValidity[] {
  return records
    .filter((record) => canAccessStudent(guardian, { id: record.studentId, campusId: record.campusId, classId: null }))
    .map((record) => ({
      studentId: record.studentId,
      studentName: record.studentName,
      serviceType: record.serviceType,
      validUntil: record.validUntil,
      statusLabel: `当前服务有效期至 ${formatDate(record.validUntil)}`,
    }));
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
