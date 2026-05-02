import { validateGuardianBindingInput, type GuardianBindingStudent } from '@/domain/admin/guardian-binding';

export type AdminGuardianBindingRecord = {
  id: string;
  guardianName: string;
  phone: string;
  relationship: string;
  studentId: string;
  studentName: string;
  notifyEnabled: boolean;
};

type AdminGuardianBindingProps = {
  students: readonly GuardianBindingStudent[];
  bindings: readonly AdminGuardianBindingRecord[];
};

const emptyBinding = {
  guardianName: '',
  phone: '',
  relationship: '',
  studentId: '',
  notifyEnabled: true,
};

export function AdminGuardianBinding({ students, bindings }: AdminGuardianBindingProps) {
  const validation = validateGuardianBindingInput(emptyBinding, students);
  const studentError = validation.success ? null : validation.errors.studentId;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted">Guardian Binding</p>
        <h2 className="font-heading text-3xl font-bold">家长绑定管理</h2>
        <p className="mt-2 text-sm text-muted">维护家长姓名、手机号、亲属关系、通知开关，并确保家长只能查看绑定孩子。</p>
      </div>

      {studentError === '绑定学生必选' ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          家长绑定后只能看到对应孩子
        </div>
      ) : null}

      <form className="grid gap-5 rounded-3xl bg-surface p-6 shadow-neu-sm" aria-label="家长绑定表单">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            家长姓名
            <input className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none" name="guardianName" required />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            手机号
            <input className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none" name="phone" required />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            与学生关系
            <input className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none" name="relationship" required />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            绑定学生
            <select className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none" name="studentId" required>
              <option value="">请选择学生</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex min-h-11 items-center gap-2 rounded-2xl bg-surfaceAlt px-4 py-2 text-sm font-semibold">
          <input defaultChecked name="notifyEnabled" type="checkbox" />
          开启到托和作业通知
        </label>

        <div className="flex flex-wrap gap-3">
          <button className="min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" type="submit">
            保存绑定
          </button>
          <a className="inline-flex min-h-11 items-center rounded-full bg-surfaceAlt px-5 py-2 text-sm font-semibold" href="/admin/students">
            返回学生列表
          </a>
        </div>
      </form>

      <div className="overflow-hidden rounded-3xl bg-surface shadow-neu-sm">
        {bindings.length === 0 ? (
          <p className="p-6 text-sm text-muted">暂无家长绑定</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-surfaceAlt text-muted">
              <tr>
                <th className="px-5 py-4 font-semibold">家长姓名</th>
                <th className="px-5 py-4 font-semibold">手机号</th>
                <th className="px-5 py-4 font-semibold">关系</th>
                <th className="px-5 py-4 font-semibold">绑定学生</th>
                <th className="px-5 py-4 font-semibold">通知</th>
              </tr>
            </thead>
            <tbody>
              {bindings.map((binding) => (
                <tr key={binding.id} className="border-t border-white/70">
                  <td className="px-5 py-4 font-semibold">{binding.guardianName}</td>
                  <td className="px-5 py-4">{binding.phone}</td>
                  <td className="px-5 py-4">{binding.relationship}</td>
                  <td className="px-5 py-4">{binding.studentName}</td>
                  <td className="px-5 py-4">{binding.notifyEnabled ? '开启' : '关闭'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
