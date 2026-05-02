import { SERVICE_TYPES, type ServiceType } from '@/domain/shared/enums';
import { validateCampusFormInput, type CampusFormStatus } from '@/domain/admin/campus-form';

export type AdminCampusFormValue = {
  name: string;
  address: string;
  phone: string;
  principalName: string;
  serviceHours: string;
  status: CampusFormStatus;
  supportedServiceTypes: readonly ServiceType[];
};

type AdminCampusFormProps = {
  mode: 'new' | 'edit';
  initialValue?: AdminCampusFormValue;
};

const emptyValue: AdminCampusFormValue = {
  name: '',
  address: '',
  phone: '',
  principalName: '',
  serviceHours: '',
  status: 'ACTIVE',
  supportedServiceTypes: [],
};

export function AdminCampusForm({ mode, initialValue }: AdminCampusFormProps) {
  const value = initialValue ?? emptyValue;
  const validation = validateCampusFormInput(value);
  const businessRestriction = validation.success ? validation.data.businessRestriction : null;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted">Campus Form</p>
        <h2 className="font-heading text-3xl font-bold">{mode === 'new' ? '新建校区' : '编辑校区'}</h2>
        <p className="mt-2 text-sm text-muted">维护校区名称、地址、联系电话、负责人和固定服务类型。</p>
      </div>

      {businessRestriction ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          {businessRestriction}
        </div>
      ) : null}

      <form className="grid gap-5 rounded-3xl bg-surface p-6 shadow-neu-sm" aria-label="校区资料表单">
        <label className="grid gap-2 text-sm font-semibold">
          校区名称
          <input
            className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
            defaultValue={value.name}
            name="name"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          校区地址
          <input
            className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
            defaultValue={value.address}
            name="address"
            required
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            联系电话
            <input
              className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
              defaultValue={value.phone}
              name="phone"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            负责人
            <input
              className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
              defaultValue={value.principalName}
              name="principalName"
              required
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold">
          服务时段
          <input
            className="min-h-11 rounded-2xl border border-white/70 bg-surfaceAlt px-4 py-2 font-normal outline-none"
            defaultValue={value.serviceHours}
            name="serviceHours"
            required
          />
        </label>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold">服务类型</legend>
          <div className="grid gap-2 md:grid-cols-4">
            {SERVICE_TYPES.map((serviceType) => (
              <label key={serviceType} className="flex min-h-11 items-center gap-2 rounded-2xl bg-surfaceAlt px-4 py-2 text-sm">
                <input
                  defaultChecked={value.supportedServiceTypes.includes(serviceType)}
                  name="supportedServiceTypes"
                  type="checkbox"
                  value={serviceType}
                />
                {serviceType}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold">校区状态</legend>
          <div className="flex flex-wrap gap-3">
            <label className="flex min-h-11 items-center gap-2 rounded-2xl bg-surfaceAlt px-4 py-2 text-sm">
              <input defaultChecked={value.status === 'ACTIVE'} name="status" type="radio" value="ACTIVE" />
              启用
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-2xl bg-surfaceAlt px-4 py-2 text-sm">
              <input defaultChecked={value.status === 'INACTIVE'} name="status" type="radio" value="INACTIVE" />
              停用
            </label>
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <button className="min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" type="submit">
            保存校区
          </button>
          <a className="inline-flex min-h-11 items-center rounded-full bg-surfaceAlt px-5 py-2 text-sm font-semibold" href="/admin/campuses">
            返回列表
          </a>
        </div>
      </form>
    </section>
  );
}
