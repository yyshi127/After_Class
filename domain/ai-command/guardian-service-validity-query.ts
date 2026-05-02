import {
  getGuardianVisibleServiceValidity,
  type BillingRecordForServiceValidity,
} from '@/domain/billing/service-validity';
import type { PermissionActor } from '@/domain/auth/permissions';

export type GuardianServiceValidityQueryInput = {
  guardian: PermissionActor;
  records: readonly BillingRecordForServiceValidity[];
  studentEntity?: {
    studentId?: string | null;
  } | null;
};

export type GuardianServiceValidityQueryResult = {
  studentId: string;
  studentName: string;
  serviceType: string;
  validUntil: string;
  statusLabel: string;
  renewalGuidance: string;
};

const RENEWAL_GUIDANCE = '如需续费或调整托管套餐，请联系校区老师确认。';

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function queryGuardianServiceValidityForAi(
  input: GuardianServiceValidityQueryInput,
): GuardianServiceValidityQueryResult[] {
  const visibleValidities = getGuardianVisibleServiceValidity({
    guardian: input.guardian,
    records: input.records,
  });
  const requestedStudentId = input.studentEntity?.studentId ?? null;

  return visibleValidities
    .filter((validity) => !requestedStudentId || validity.studentId === requestedStudentId)
    .map((validity) => ({
      studentId: validity.studentId,
      studentName: validity.studentName,
      serviceType: validity.serviceType,
      validUntil: formatDate(validity.validUntil),
      statusLabel: validity.statusLabel,
      renewalGuidance: RENEWAL_GUIDANCE,
    }));
}
