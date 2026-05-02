import { AdminClassAssignmentPanel } from '@/components/admin/admin-class-assignment-panel';
import { AdminLayout } from '@/components/admin/admin-layout';
import type { AssignableClass, AssignableStudent, AssignableTeacher } from '@/domain/admin/class-assignment';
import { DEMO_SEED } from '@/prisma/seed-data';

function getAssignableClasses(): AssignableClass[] {
  return DEMO_SEED.classes.map((custodyClass) => ({
    id: custodyClass.id,
    name: custodyClass.name,
    campusId: custodyClass.campusId,
    campusName: DEMO_SEED.campuses.find((campus) => campus.id === custodyClass.campusId)?.name ?? '未知校区',
    capacity: custodyClass.capacity,
  }));
}

function getAssignableTeachers(): AssignableTeacher[] {
  return DEMO_SEED.users
    .filter((user) => user.role === 'TEACHER' || user.role === 'ASSISTANT')
    .map((teacher) => ({
      id: teacher.id,
      name: teacher.name,
      campusIds: DEMO_SEED.teacherAssignments.filter((assignment) => assignment.teacherUserId === teacher.id).map((assignment) => assignment.campusId),
    }));
}

function getAssignableStudents(): AssignableStudent[] {
  return DEMO_SEED.students.map((student) => ({
    id: student.id,
    name: student.name,
    campusId: student.campusId,
    classId: student.classId,
  }));
}

export default function AdminClassAssignmentsPage() {
  const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminClassAssignmentPanel actor={actor} classes={getAssignableClasses()} teachers={getAssignableTeachers()} students={getAssignableStudents()} />
    </AdminLayout>
  );
}
