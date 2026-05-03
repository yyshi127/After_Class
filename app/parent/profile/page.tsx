import { getGuardianVisibleServiceValidity } from '@/domain/billing/service-validity';
import { getParentProfileStudents } from '@/domain/parent/profile';
import { ParentProfileServicePage } from '@/components/parent/parent-profile-service-page';
import { DEMO_SEED } from '@/prisma/seed-data';

const demoGuardian = DEMO_SEED.users.find((user) => user.role === 'GUARDIAN');
const demoStudent = DEMO_SEED.students[0];

const guardianActor = demoGuardian
  ? {
      id: demoGuardian.id,
      role: demoGuardian.role,
      guardianStudentIds: DEMO_SEED.guardianStudents
        .filter((binding) => binding.guardianUserId === demoGuardian.id)
        .map((binding) => binding.studentId),
    }
  : null;

const serviceValidities = guardianActor && demoStudent
  ? getGuardianVisibleServiceValidity({
      guardian: guardianActor,
      records: [
        {
          id: 'billing-wang-demo-202605',
          campusId: demoStudent.campusId,
          studentId: demoStudent.id,
          studentName: demoStudent.name,
          serviceType: demoStudent.serviceType,
          billingCycle: 'MONTHLY',
          periodStart: new Date('2026-05-01T00:00:00.000Z'),
          periodEnd: new Date('2026-05-31T23:59:59.000Z'),
          amountDue: 1800,
          amountPaid: 1800,
          balanceAmount: 0,
          debtAmount: 0,
          validUntil: new Date('2026-05-31T23:59:59.000Z'),
        },
      ],
    })
  : [];

const profiles = guardianActor
  ? getParentProfileStudents({
      guardian: guardianActor,
      students: DEMO_SEED.students,
      guardianBindings: DEMO_SEED.guardianStudents,
      serviceValidities,
      leaveRecords: demoStudent
        ? [
            {
              id: 'leave-wang-20260504',
              studentId: demoStudent.id,
              leaveDate: '2026-05-04',
              serviceType: demoStudent.serviceType,
              reason: '孩子发烧',
              status: '已确认',
            },
          ]
        : [],
    })
  : [];

export default function ParentProfilePage() {
  return (
    <main aria-label="家长我的服务页" className="min-h-screen overflow-x-hidden px-4 py-6 text-text sm:px-6 sm:py-10">
      <div className="mx-auto grid max-w-5xl gap-6">
        <ParentProfileServicePage profiles={profiles} />
      </div>
    </main>
  );
}
