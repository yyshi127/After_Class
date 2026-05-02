import { getAdminAttendanceStats, type AdminAttendanceStatsRow } from '@/domain/admin/attendance-stats';
import type { PermissionActor } from '@/domain/auth/permissions';

type AdminAttendanceStatsProps = {
  actor: PermissionActor;
  rows: readonly AdminAttendanceStatsRow[];
};

export function AdminAttendanceStats({ actor, rows }: AdminAttendanceStatsProps) {
  const stats = getAdminAttendanceStats(actor, rows);

  if (stats.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-muted">Attendance</p>
          <h2 className="font-heading text-3xl font-bold">考勤统计</h2>
        </div>
        <p className="rounded-3xl bg-surface p-6 text-sm text-muted shadow-neu-sm">暂无可查看考勤统计</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted">Attendance</p>
        <h2 className="font-heading text-3xl font-bold">考勤统计</h2>
        <p className="mt-2 text-sm text-muted">按校区、班级、托管类型汇总今日应到、实到、请假和缺勤。</p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-surface shadow-neu-sm">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-surfaceAlt text-muted">
            <tr>
              <th className="px-5 py-4 font-semibold">校区</th>
              <th className="px-5 py-4 font-semibold">班级</th>
              <th className="px-5 py-4 font-semibold">托管类型</th>
              <th className="px-5 py-4 font-semibold">应到</th>
              <th className="px-5 py-4 font-semibold">实到</th>
              <th className="px-5 py-4 font-semibold">请假</th>
              <th className="px-5 py-4 font-semibold">缺勤</th>
              <th className="px-5 py-4 font-semibold">出勤率</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((item) => (
              <tr key={`${item.campusId}-${item.classId}-${item.serviceType}`} className="border-t border-white/70">
                <td className="px-5 py-4">{item.campusName}</td>
                <td className="px-5 py-4 font-semibold">{item.className}</td>
                <td className="px-5 py-4">{item.serviceType}</td>
                <td className="px-5 py-4">{item.expectedCount}</td>
                <td className="px-5 py-4">{item.arrivedCount}</td>
                <td className="px-5 py-4">{item.leaveCount}</td>
                <td className="px-5 py-4">{item.absentCount}</td>
                <td className="px-5 py-4">{item.attendanceRateLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
