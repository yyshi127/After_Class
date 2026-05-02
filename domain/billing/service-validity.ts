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

export type ServiceExpiryReminderStage = 'UPCOMING' | 'DUE_TODAY' | 'OVERDUE_MANUAL';

export type ServiceExpiryReminder = {
  billingRecordId: string;
  campusId: string;
  studentId: string;
  studentName: string;
  serviceType: string;
  validUntil: Date;
  daysUntilExpiry: number;
  reminderStage: ServiceExpiryReminderStage;
  reminderLabel: string;
  shouldAutoNotify: boolean;
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

export function getServiceExpiryReminders({
  today,
  records,
  windowDays = 7,
}: {
  today: Date;
  records: readonly BillingRecordForServiceValidity[];
  windowDays?: number;
}): ServiceExpiryReminder[] {
  const todayDay = toUtcDateOnly(today).getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  return records
    .map((record) => {
      const expiryDay = toUtcDateOnly(record.validUntil).getTime();
      const daysUntilExpiry = Math.round((expiryDay - todayDay) / dayMs);
      return {
        billingRecordId: record.id,
        campusId: record.campusId,
        studentId: record.studentId,
        studentName: record.studentName,
        serviceType: record.serviceType,
        validUntil: record.validUntil,
        daysUntilExpiry,
        ...buildReminderStage(daysUntilExpiry),
      } satisfies ServiceExpiryReminder;
    })
    .filter((reminder) => reminder.daysUntilExpiry <= windowDays)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry || a.studentName.localeCompare(b.studentName, 'zh-Hans-CN'));
}

function buildReminderStage(daysUntilExpiry: number): Pick<
  ServiceExpiryReminder,
  'reminderStage' | 'reminderLabel' | 'shouldAutoNotify'
> {
  if (daysUntilExpiry < 0) {
    return {
      reminderStage: 'OVERDUE_MANUAL',
      reminderLabel: `服务已逾期 ${Math.abs(daysUntilExpiry)} 天，请人工跟进续费`,
      shouldAutoNotify: false,
    };
  }

  if (daysUntilExpiry === 0) {
    return {
      reminderStage: 'DUE_TODAY',
      reminderLabel: '服务今天到期',
      shouldAutoNotify: true,
    };
  }

  return {
    reminderStage: 'UPCOMING',
    reminderLabel: `服务将在 ${daysUntilExpiry} 天后到期`,
    shouldAutoNotify: true,
  };
}

function toUtcDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
