import { validateClassFormInput, type ClassFormCampus } from '@/domain/admin/class-form';

export type AdminClassFormValue = {
  campusId: string;
  grade: string;
  name: string;
  capacity: number;
};

type AdminClassFormProps = {
  mode: 'new' | 'edit';
  campuses: readonly ClassFormCampus[];
  initialValue?: AdminClassFormValue;
};

const emptyValue: AdminClassFormValue = {
  campusId: '',
  grade: '',
  name: '',
  capacity: 24,
};

export function AdminClassForm({ mode, campuses, initialValue }: AdminClassFormProps) {
  const value = initialValue ?? emptyValue;
  const validation = validateClassFormInput(value, campuses);
  const campusError = validation.success ? null : validation.errors.campusId;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted">Class Form</p>
        <h2 className="font-heading text-3xl font-bold">{mode === 'new' ? '新建班级' : '编辑班级'}</h2>
        <p className="mt-2 text-sm text-muted">维护班级所属校区、年级、班级名称和容量。</p>
      </div>

      {campusError ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          {campusError}
        </div>
      ) : null}

      <form className="grid gap-5 rounded-3xl bg-surface p-6 shadow-neu-sm" aria-label="班级资料表单">
        <label className="grid gap-2 text-sm font-semibold">
          所属校区
          <select
            className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
            defaultValue={value.campusId}
            name="campusId"
            required
          >
            <option value="">请选择校区</option>
            {campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}{campus.status === 'INACTIVE' ? '（停用）' : ''}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            年级
            <input
              className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
              defaultValue={value.grade}
              name="grade"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            班级名称
            <input
              className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
              defaultValue={value.name}
              name="name"
              required
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold">
          容量
          <input
            className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
            defaultValue={value.capacity}
            min={1}
            name="capacity"
            required
            type="number"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button className="min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" type="submit">
            保存班级
          </button>
          <a className="inline-flex min-h-11 items-center rounded-full bg-surfaceAlt px-5 py-2 text-sm font-semibold" href="/admin/classes">
            返回列表
          </a>
        </div>
      </form>
    </section>
  );
}
