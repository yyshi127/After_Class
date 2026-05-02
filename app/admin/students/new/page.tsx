import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminStudentForm } from '@/components/admin/admin-student-form';
import { DEMO_SEED } from '@/prisma/seed-data';

export default function AdminStudentNewPage() {
  const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminStudentForm mode="new" campuses={DEMO_SEED.campuses} classes={DEMO_SEED.classes} />
    </AdminLayout>
  );
}
