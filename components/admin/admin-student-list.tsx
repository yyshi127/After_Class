import { AdminDataTableFrame } from '@/components/admin/admin-data-table-frame';
import { canAccessAdminStudentList, getAdminStudentListItems, studentStatusLabel, type AdminStudentRecord } from '@/domain/admin/student-list';
import type { PermissionActor } from '@/domain/auth/permissions';

type AdminStudentListProps = {
  actor: PermissionActor;
  students: readonly AdminStudentRecord[];
  isLoading?: boolean;
  errorMessage?: string;
};

export function AdminStudentList({ actor, students, isLoading = false, errorMessage }: AdminStudentListProps) {
  if (!canAccessAdminStudentList(actor)) {
    return <p className="rounded-3xl bg-surface p-6 text-sm font-semibold text-destructive shadow-neu-sm">无权访问管理端学生全量列表</p>;
  }

  const studentItems = getAdminStudentListItems(actor, students);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted">Students</p>
          <h2 className="font-heading text-3xl font-bold">学生档案</h2>
        </div>
        <a className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" href="/admin/students/new">
          新建学生
        </a>
      </div>

      <AdminDataTableFrame
        emptyMessage="暂无可查看学生"
        errorMessage={errorMessage}
        isLoading={isLoading}
        itemLabel="学生资料"
        minWidthClassName="min-w-[860px]"
        title="学生资料表格"
        totalCount={studentItems.length}
      >
          <table className="w-full text-left text-sm">
            <thead className="bg-surfaceAlt text-muted">
              <tr>
                <th className="px-5 py-4 font-semibold">学生姓名</th>
                <th className="px-5 py-4 font-semibold">身份证号</th>
                <th className="px-5 py-4 font-semibold">校区</th>
                <th className="px-5 py-4 font-semibold">班级</th>
                <th className="px-5 py-4 font-semibold">托管类型</th>
                <th className="px-5 py-4 font-semibold">状态</th>
              </tr>
            </thead>
            <tbody>
              {studentItems.map((student) => (
                <tr key={student.id} className="border-t border-white/70">
                  <td className="px-5 py-4 font-semibold">{student.name}</td>
                  <td className="px-5 py-4">{student.identityNumberMasked}</td>
                  <td className="px-5 py-4">{student.campusName}</td>
                  <td className="px-5 py-4">{student.className ?? '未分班'}</td>
                  <td className="px-5 py-4">{student.serviceType}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {studentStatusLabel(student.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </AdminDataTableFrame>
    </section>
  );
}
