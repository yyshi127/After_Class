import { getAdminClassListItems, type AdminClassRecord } from '@/domain/admin/class-list';
import type { PermissionActor } from '@/domain/auth/permissions';

type AdminClassListProps = {
  actor: PermissionActor;
  classes: readonly AdminClassRecord[];
};

export function AdminClassList({ actor, classes }: AdminClassListProps) {
  const classItems = getAdminClassListItems(actor, classes);

  if (classItems.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-muted">Classes</p>
          <h2 className="font-heading text-3xl font-bold">班级管理</h2>
        </div>
        <p className="rounded-3xl bg-surface p-6 text-sm text-muted shadow-neu-sm">暂无可查看班级</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted">Classes</p>
          <h2 className="font-heading text-3xl font-bold">班级管理</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <a className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" href="/admin/classes/new">
            新建班级
          </a>
          <a className="inline-flex min-h-11 items-center rounded-full bg-surfaceAlt px-5 py-2 text-sm font-semibold" href="/admin/classes/assignments">
            分配老师和学生
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-surface shadow-neu-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-surfaceAlt text-muted">
            <tr>
              <th className="px-5 py-4 font-semibold">班级</th>
              <th className="px-5 py-4 font-semibold">校区</th>
              <th className="px-5 py-4 font-semibold">年级</th>
              <th className="px-5 py-4 font-semibold">老师</th>
              <th className="px-5 py-4 font-semibold">学生数/容量</th>
              <th className="px-5 py-4 font-semibold">今日应到</th>
            </tr>
          </thead>
          <tbody>
            {classItems.map((custodyClass) => (
              <tr key={custodyClass.id} className="border-t border-white/70">
                <td className="px-5 py-4 font-semibold">{custodyClass.name}</td>
                <td className="px-5 py-4">{custodyClass.campusName}</td>
                <td className="px-5 py-4">{custodyClass.grade}</td>
                <td className="px-5 py-4">{custodyClass.teacherSummary}</td>
                <td className="px-5 py-4">{custodyClass.capacitySummary}</td>
                <td className="px-5 py-4">{custodyClass.expectedTodayCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
