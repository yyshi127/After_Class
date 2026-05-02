import { AdminGuardianBinding, type AdminGuardianBindingRecord } from '@/components/admin/admin-guardian-binding';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DEMO_SEED } from '@/prisma/seed-data';

function getDemoBindings(): AdminGuardianBindingRecord[] {
  return DEMO_SEED.guardianStudents.map((binding) => {
    const guardian = DEMO_SEED.users.find((user) => user.id === binding.guardianUserId);
    const student = DEMO_SEED.students.find((item) => item.id === binding.studentId);

    return {
      id: `${binding.guardianUserId}-${binding.studentId}`,
      guardianName: guardian?.name ?? '未知家长',
      phone: binding.phone,
      relationship: binding.relationship,
      studentId: binding.studentId,
      studentName: student?.name ?? '未知学生',
      notifyEnabled: binding.notifyEnabled,
    };
  });
}

export default function AdminGuardiansPage() {
  const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };
  const students = DEMO_SEED.students.map((student) => ({ id: student.id, name: student.name, campusId: student.campusId }));

  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminGuardianBinding students={students} bindings={getDemoBindings()} />
    </AdminLayout>
  );
}
