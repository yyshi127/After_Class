import { AdminAttendanceStats } from '@/components/admin/admin-attendance-stats';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DEMO_SEED } from '@/prisma/seed-data';

const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

const attendanceRows = [
  {
    studentId: 'demo-student-profile-wang',
    studentName: '王小明',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: '已到' as const,
  },
  {
    studentId: 'demo-student-west-hidden',
    studentName: '钱小西',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    classId: 'demo-class-west-g3',
    className: '西城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: '已到' as const,
  },
];

export default function AdminAttendancePage() {
  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminAttendanceStats actor={actor} rows={attendanceRows} />
    </AdminLayout>
  );
}
