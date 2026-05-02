import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DEMO_SEED } from '@/prisma/seed-data';

export default function AdminPage() {
  return (
    <AdminLayout
      actor={{ id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN', campusIds: ['demo-campus-east'] }}
      campuses={DEMO_SEED.campuses}
      currentUserName="东城校区管理员"
    >
      <div className="space-y-6">
        <h1 className="font-heading text-3xl font-bold">管理端工作台</h1>
        <AdminDashboard
          metrics={{
            arrivalsToday: 0,
            attendanceRate: null,
            pendingHomeworkFeedback: 0,
            expiringServices: 0,
            estimatedGrossProfitCents: null,
          }}
        />
      </div>
    </AdminLayout>
  );
}
