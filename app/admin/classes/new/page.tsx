import { AdminClassForm } from '@/components/admin/admin-class-form';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DEMO_SEED } from '@/prisma/seed-data';

export default function NewAdminClassPage() {
  const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };
  const campuses = DEMO_SEED.campuses.filter((campus) => actor.campusIds.includes(campus.id));

  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminClassForm campuses={campuses} mode="new" />
    </AdminLayout>
  );
}
