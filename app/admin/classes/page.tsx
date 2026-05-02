import { AdminClassList } from '@/components/admin/admin-class-list';
import { AdminLayout } from '@/components/admin/admin-layout';
import type { AdminClassRecord } from '@/domain/admin/class-list';
import { DEMO_SEED } from '@/prisma/seed-data';

function getDemoClassRecords(): AdminClassRecord[] {
  return DEMO_SEED.classes.map((custodyClass) => {
    const campus = DEMO_SEED.campuses.find((item) => item.id === custodyClass.campusId);
    const teacherNames = DEMO_SEED.teacherAssignments
      .filter((assignment) => assignment.classId === custodyClass.id)
      .map((assignment) => DEMO_SEED.users.find((user) => user.id === assignment.teacherUserId)?.name)
      .filter((name): name is string => Boolean(name));
    const studentCount = DEMO_SEED.students.filter((student) => student.classId === custodyClass.id).length;

    return {
      id: custodyClass.id,
      name: custodyClass.name,
      campusId: custodyClass.campusId,
      campusName: campus?.name ?? '未知校区',
      grade: custodyClass.grade,
      capacity: custodyClass.capacity,
      teacherNames,
      studentCount,
      expectedTodayCount: studentCount,
    };
  });
}

export default function AdminClassesPage() {
  const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminClassList actor={actor} classes={getDemoClassRecords()} />
    </AdminLayout>
  );
}
