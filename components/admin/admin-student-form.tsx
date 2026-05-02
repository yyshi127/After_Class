import { SERVICE_TYPES, type ServiceType, type StudentStatus } from '@/domain/shared/enums';
import { validateStudentFormInput, type StudentFormCampus, type StudentFormClass } from '@/domain/admin/student-form';

export type AdminStudentFormValue = {
  name: string;
  identityNumber: string;
  school: string;
  grade: string;
  campusId: string;
  classId: string;
  serviceType: ServiceType | '';
  status: StudentStatus;
  safetyNote: string;
};

type AdminStudentFormProps = {
  mode: 'new' | 'edit';
  campuses: readonly StudentFormCampus[];
  classes: readonly StudentFormClass[];
  initialValue?: AdminStudentFormValue;
};

const emptyValue: AdminStudentFormValue = {
  name: '',
  identityNumber: '',
  school: '',
  grade: '',
  campusId: '',
  classId: '',
  serviceType: '',
  status: 'ACTIVE',
  safetyNote: '',
};

export function AdminStudentForm({ mode, campuses, classes, initialValue }: AdminStudentFormProps) {
  const value = initialValue ?? emptyValue;
  const validation = validateStudentFormInput(value, campuses, classes);
  const serviceTypeError = validation.success ? null : validation.errors.serviceType;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted">Student Form</p>
        <h2 className="font-heading text-3xl font-bold">{mode === 'new' ? '新建学生' : '编辑学生'}</h2>
        <p className="mt-2 text-sm text-muted">维护学生基础信息、校区班级、固定托管类型和安全备注。</p>
      </div>

      {serviceTypeError === '托管类型必选' ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          未选托管类型不能保存
        </div>
      ) : null}

      <form className="grid gap-5 rounded-3xl bg-surface p-6 shadow-neu-sm" aria-label="学生资料表单">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            学生姓名
            <input
              className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
              defaultValue={value.name}
              name="name"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            身份证号
            <input
              className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
              defaultValue={value.identityNumber}
              name="identityNumber"
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            就读学校
            <input
              className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
              defaultValue={value.school}
              name="school"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            年级
            <input
              className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
              defaultValue={value.grade}
              name="grade"
              required
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            校区
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

          <label className="grid gap-2 text-sm font-semibold">
            班级
            <select
              className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
              defaultValue={value.classId}
              name="classId"
              required
            >
              <option value="">请选择班级</option>
              {classes.map((custodyClass) => (
                <option key={custodyClass.id} value={custodyClass.id}>
                  {custodyClass.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold">托管类型</legend>
          <div className="grid gap-2 md:grid-cols-4">
            {SERVICE_TYPES.map((serviceType) => (
              <label key={serviceType} className="flex min-h-11 items-center gap-2 rounded-2xl bg-surfaceAlt px-4 py-2 text-sm">
                <input
                  defaultChecked={value.serviceType === serviceType}
                  name="serviceType"
                  required
                  type="radio"
                  value={serviceType}
                />
                {serviceType}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold">学生状态</legend>
          <div className="flex flex-wrap gap-3">
            <label className="flex min-h-11 items-center gap-2 rounded-2xl bg-surfaceAlt px-4 py-2 text-sm">
              <input defaultChecked={value.status === 'ACTIVE'} name="status" type="radio" value="ACTIVE" />
              在读
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-2xl bg-surfaceAlt px-4 py-2 text-sm">
              <input defaultChecked={value.status === 'PAUSED'} name="status" type="radio" value="PAUSED" />
              暂停
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-2xl bg-surfaceAlt px-4 py-2 text-sm">
              <input defaultChecked={value.status === 'LEFT'} name="status" type="radio" value="LEFT" />
              已离班
            </label>
          </div>
        </fieldset>

        <label className="grid gap-2 text-sm font-semibold">
          安全备注
          <textarea
            className="min-h-24 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-3 font-normal outline-none"
            defaultValue={value.safetyNote}
            name="safetyNote"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button className="min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" type="submit">
            保存学生
          </button>
          <a className="inline-flex min-h-11 items-center rounded-full bg-surfaceAlt px-5 py-2 text-sm font-semibold" href="/admin/students">
            返回列表
          </a>
        </div>
      </form>
    </section>
  );
}
