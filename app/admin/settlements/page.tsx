import { AdminClassSettlements } from '@/components/admin/admin-class-settlements';
import { AdminLayout } from '@/components/admin/admin-layout';
import type { AdminClassSettlementRow } from '@/domain/admin/class-settlements';
import { DEMO_SEED } from '@/prisma/seed-data';

const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

const settlements: AdminClassSettlementRow[] = [
  {
    id: 'settlement-east-evening',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    serviceType: '晚辅导',
    teacherUserIds: ['teacher-wang'],
    teacherNames: ['王老师'],
    settlementDate: new Date('2026-05-20T00:00:00.000Z'),
    expectedCount: 4,
    arrivedCount: 1,
    leaveCount: 1,
    absentCount: 1,
    pendingCount: 1,
    studentRevenueAmount: 90,
    teacherFeeAmount: 220,
    reservedCostAmount: 30,
    estimatedGrossProfitAmount: -160,
  },
  {
    id: 'settlement-west-evening',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    classId: 'demo-class-west-g3',
    className: '西城三年级晚辅 A 班',
    serviceType: '晚辅导',
    teacherUserIds: ['teacher-zhao'],
    teacherNames: ['赵老师'],
    settlementDate: new Date('2026-05-20T00:00:00.000Z'),
    expectedCount: 3,
    arrivedCount: 3,
    leaveCount: 0,
    absentCount: 0,
    pendingCount: 0,
    studentRevenueAmount: 270,
    teacherFeeAmount: 200,
    reservedCostAmount: 30,
    estimatedGrossProfitAmount: 40,
  },
];

export default function AdminSettlementsPage() {
  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminClassSettlements actor={actor} settlements={settlements} />
    </AdminLayout>
  );
}
