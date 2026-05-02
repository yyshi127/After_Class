import { AdminCampusList } from '@/components/admin/admin-campus-list';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DEMO_SEED } from '@/prisma/seed-data';

export default function AdminCampusesPage() {
  return (
    <AdminLayout
      actor={{ id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN', campusIds: ['demo-campus-east'] }}
      campuses={DEMO_SEED.campuses}
      currentUserName="东城校区管理员"
    >
      <AdminCampusList campuses={DEMO_SEED.campuses} filters={{ keyword: '', status: 'ALL' }} />
    </AdminLayout>
  );
}
