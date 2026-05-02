import { ParentHomeSafetyCard } from '@/components/parent/parent-home-safety-card';
import { getParentSafetyArrivalCards } from '@/domain/parent/safety-arrival';
import { DEMO_SEED } from '@/prisma/seed-data';

const demoGuardian = DEMO_SEED.users.find((user) => user.role === 'GUARDIAN');
const demoTeacher = DEMO_SEED.users.find((user) => user.role === 'TEACHER');
const demoStudent = DEMO_SEED.students[0];

const safetyCards = demoGuardian
  ? getParentSafetyArrivalCards({
      actor: {
        id: demoGuardian.id,
        role: demoGuardian.role,
        guardianStudentIds: DEMO_SEED.guardianStudents
          .filter((binding) => binding.guardianUserId === demoGuardian.id)
          .map((binding) => binding.studentId),
      },
      students: DEMO_SEED.students,
      teachers: demoTeacher ? [{ id: demoTeacher.id, name: demoTeacher.name }] : [],
      attendanceRecords: demoStudent
        ? [
            {
              id: 'demo-attendance-arrival-wang',
              campusId: demoStudent.campusId,
              classId: demoStudent.classId,
              studentId: demoStudent.id,
              teacherUserId: demoTeacher?.id ?? null,
              serviceType: demoStudent.serviceType,
              status: '已到',
              checkedAt: new Date('2026-05-02T10:30:00.000Z'),
              photoFileId: 'photo://demo-arrival-wang',
              matchStatus: 'MATCHED',
              notificationStatus: 'SENT',
            },
          ]
        : [],
    })
  : [];

export default function ParentPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-text">
      <div className="mx-auto grid max-w-5xl gap-6">
        <section className="rounded-neu bg-surface p-8 shadow-neu">
          <p className="mb-3 text-sm font-semibold text-muted">Parent Portal</p>
          <h1 className="mb-4 font-heading text-3xl font-bold">家长端首页</h1>
          <p className="max-w-2xl text-muted">查看孩子到托安全状态、考勤时间线、作业反馈和服务有效期提醒。</p>
        </section>

        <ParentHomeSafetyCard cards={safetyCards} />
      </div>
    </main>
  );
}
