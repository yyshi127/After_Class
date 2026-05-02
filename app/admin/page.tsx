import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DEMO_SEED } from '@/prisma/seed-data';

export default function AdminPage() {
  return (
    <AdminLayout
      actor={{ id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN', campusIds: ['demo-campus-east'] }}
      campuses={DEMO_SEED.campuses}
      currentUserName="东城校区管理员"
    >
      <div className="space-y-6">
        <h1 className="font-heading text-3xl font-bold">管理端工作台</h1>
        <AdminDashboard
          campusOptions={[
            { id: 'all', name: '全部校区' },
            { id: 'demo-campus-east', name: '东城校区' },
          ]}
          metrics={{
            arrivalsToday: 42,
            attendanceRate: 0.93,
            pendingHomeworkFeedback: 7,
            expiringServices: 5,
            estimatedGrossProfitCents: 128600,
          }}
          riskItems={[
            { id: 'expiry', title: '5 名学生 7 天内服务到期', severity: 'HIGH', owner: '校区教务', dueLabel: '今日跟进' },
            { id: 'homework', title: '7 份作业待老师确认发布', severity: 'MEDIUM', owner: '晚辅老师', dueLabel: '放学前完成' },
          ]}
          todoItems={[
            { id: 'attendance', title: '复核今日待确认到托照片', href: '/admin/attendance' },
            { id: 'homework', title: '处理 7 份待发布作业反馈', href: '/admin/homework-feedback' },
            { id: 'settlement', title: '查看今日班级核算毛利', href: '/admin/settlements' },
          ]}
          trendPoints={[
            { label: '周一', attendanceRate: 0.9, grossProfitCents: 98000 },
            { label: '周二', attendanceRate: 0.93, grossProfitCents: 128600 },
            { label: '周三', attendanceRate: 0.91, grossProfitCents: 116400 },
            { label: '周四', attendanceRate: 0.95, grossProfitCents: 139200 },
          ]}
        />
      </div>
    </AdminLayout>
  );
}
