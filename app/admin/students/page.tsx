import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminStudentList } from '@/components/admin/admin-student-list';
import type { AdminStudentRecord } from '@/domain/admin/student-list';
import { DEMO_SEED } from '@/prisma/seed-data';

function getDemoStudentRecords(): AdminStudentRecord[] {
  return DEMO_SEED.students.map((student) => {
    const campus = DEMO_SEED.campuses.find((item) => item.id === student.campusId);
    const custodyClass = DEMO_SEED.classes.find((item) => item.id === student.classId);

    return {
      id: student.id,
      name: student.name,
      identityNumber: student.identityNumber,
      campusId: student.campusId,
      campusName: campus?.name ?? '未知校区',
      classId: student.classId,
      className: custodyClass?.name ?? null,
      serviceType: student.serviceType,
      status: student.status,
    };
  });
}

export default function AdminStudentsPage() {
  const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminStudentList actor={actor} students={getDemoStudentRecords()} />
    </AdminLayout>
  );
}
