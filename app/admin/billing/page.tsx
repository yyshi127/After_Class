import { AdminBillingRecords } from '@/components/admin/admin-billing-records';
import { AdminLayout } from '@/components/admin/admin-layout';
import type { AdminBillingRecordRow } from '@/domain/admin/billing-records';
import { DEMO_SEED } from '@/prisma/seed-data';

const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

const records: AdminBillingRecordRow[] = [
  {
    id: 'billing-east-xiaoming',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    studentId: 'demo-student-profile-wang',
    studentName: '王小明',
    serviceType: '晚辅导',
    billingCycle: 'MONTHLY',
    periodStart: new Date('2026-05-01T00:00:00.000Z'),
    periodEnd: new Date('2026-05-31T00:00:00.000Z'),
    amountDue: 1800,
    amountPaid: 1800,
    balanceAmount: 0,
    debtAmount: 0,
    validUntil: new Date('2026-05-31T00:00:00.000Z'),
  },
  {
    id: 'billing-east-lili',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    studentId: 'demo-student-lili',
    studentName: '李莉',
    serviceType: '晚全托',
    billingCycle: 'SEMESTER',
    periodStart: new Date('2026-02-20T00:00:00.000Z'),
    periodEnd: new Date('2026-07-20T00:00:00.000Z'),
    amountDue: 7200,
    amountPaid: 7000,
    balanceAmount: 0,
    debtAmount: 200,
    validUntil: new Date('2026-07-20T00:00:00.000Z'),
  },
  {
    id: 'billing-hidden-west',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    classId: 'demo-class-west-g3',
    className: '西城三年级晚辅 A 班',
    studentId: 'demo-student-west',
    studentName: '赵同学',
    serviceType: '晚辅导',
    billingCycle: 'MONTHLY',
    periodStart: new Date('2026-05-01T00:00:00.000Z'),
    periodEnd: new Date('2026-05-31T00:00:00.000Z'),
    amountDue: 1800,
    amountPaid: 0,
    balanceAmount: 0,
    debtAmount: 1800,
    validUntil: new Date('2026-05-31T00:00:00.000Z'),
  },
];

export default function AdminBillingPage() {
  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminBillingRecords actor={actor} records={records} />
    </AdminLayout>
  );
}
