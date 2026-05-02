import { describe, expect, it } from 'vitest';

import { getServiceExpiryReminders } from '@/domain/billing/service-validity';

const baseRecord = {
  id: 'billing-wang-202605',
  campusId: 'campus-east',
  studentId: 'student-wang',
  studentName: '王小明',
  serviceType: '晚辅导',
  billingCycle: 'MONTHLY' as const,
  periodStart: new Date('2026-05-01T00:00:00.000Z'),
  periodEnd: new Date('2026-05-31T23:59:59.000Z'),
  amountDue: 1800,
  amountPaid: 1800,
  balanceAmount: 0,
  debtAmount: 0,
  validUntil: new Date('2026-05-31T23:59:59.000Z'),
};

describe('service expiry reminders', () => {
  it('returns service records expiring within 7 days and excludes later records', () => {
    const reminders = getServiceExpiryReminders({
      today: new Date('2026-05-24T10:00:00.000Z'),
      records: [
        baseRecord,
        {
          ...baseRecord,
          id: 'billing-due-tomorrow',
          studentId: 'student-li',
          studentName: '李小红',
          validUntil: new Date('2026-05-25T23:59:59.000Z'),
        },
        {
          ...baseRecord,
          id: 'billing-later',
          studentId: 'student-chen',
          studentName: '陈同学',
          validUntil: new Date('2026-06-02T23:59:59.000Z'),
        },
      ],
    });

    expect(reminders.map((reminder) => reminder.studentId)).toEqual(['student-li', 'student-wang']);
    expect(reminders[0]).toMatchObject({
      daysUntilExpiry: 1,
      reminderStage: 'UPCOMING',
      reminderLabel: '服务将在 1 天后到期',
      shouldAutoNotify: true,
    });
    expect(reminders[1]).toMatchObject({
      daysUntilExpiry: 7,
      reminderStage: 'UPCOMING',
      reminderLabel: '服务将在 7 天后到期',
      shouldAutoNotify: true,
    });
  });

  it('separates due-today auto reminder from overdue manual reminder without exposing amounts', () => {
    const reminders = getServiceExpiryReminders({
      today: new Date('2026-05-24T10:00:00.000Z'),
      records: [
        {
          ...baseRecord,
          id: 'billing-due-today',
          validUntil: new Date('2026-05-24T23:59:59.000Z'),
        },
        {
          ...baseRecord,
          id: 'billing-overdue',
          studentId: 'student-overdue',
          studentName: '逾期学生',
          amountDue: 2400,
          amountPaid: 0,
          balanceAmount: 0,
          debtAmount: 2400,
          validUntil: new Date('2026-05-20T23:59:59.000Z'),
        },
      ],
    });

    expect(reminders).toEqual([
      {
        billingRecordId: 'billing-overdue',
        campusId: 'campus-east',
        studentId: 'student-overdue',
        studentName: '逾期学生',
        serviceType: '晚辅导',
        validUntil: new Date('2026-05-20T23:59:59.000Z'),
        daysUntilExpiry: -4,
        reminderStage: 'OVERDUE_MANUAL',
        reminderLabel: '服务已逾期 4 天，请人工跟进续费',
        shouldAutoNotify: false,
      },
      {
        billingRecordId: 'billing-due-today',
        campusId: 'campus-east',
        studentId: 'student-wang',
        studentName: '王小明',
        serviceType: '晚辅导',
        validUntil: new Date('2026-05-24T23:59:59.000Z'),
        daysUntilExpiry: 0,
        reminderStage: 'DUE_TODAY',
        reminderLabel: '服务今天到期',
        shouldAutoNotify: true,
      },
    ]);
    expect(JSON.stringify(reminders)).not.toMatch(/amountDue|amountPaid|balanceAmount|debtAmount|2400/);
  });
});
