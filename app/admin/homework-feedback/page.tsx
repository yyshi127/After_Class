import { AdminHomeworkFeedbackProgress } from '@/components/admin/admin-homework-feedback-progress';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DEMO_SEED } from '@/prisma/seed-data';

const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

const rows = [
  {
    id: 'review-uploaded-east',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: 'UPLOADED' as const,
    publishStatus: 'DRAFT' as const,
  },
  {
    id: 'review-reviewed-east',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: 'TEACHER_REVIEWED' as const,
    publishStatus: 'DRAFT' as const,
  },
  {
    id: 'review-published-east',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: 'TEACHER_REVIEWED' as const,
    publishStatus: 'PUBLISHED' as const,
  },
  {
    id: 'review-hidden-west',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    classId: 'demo-class-west-g3',
    className: '西城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: 'TEACHER_REVIEWED' as const,
    publishStatus: 'PUBLISHED' as const,
  },
];

export default function AdminHomeworkFeedbackPage() {
  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <AdminHomeworkFeedbackProgress actor={actor} rows={rows} />
    </AdminLayout>
  );
}
