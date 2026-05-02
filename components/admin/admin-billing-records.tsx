import { getAdminBillingRecords, type AdminBillingRecordRow } from '@/domain/admin/billing-records';
import type { PermissionActor } from '@/domain/auth/permissions';

type AdminBillingRecordsProps = {
  actor: PermissionActor;
  records: readonly AdminBillingRecordRow[];
};

export function AdminBillingRecords({ actor, records }: AdminBillingRecordsProps) {
  const visibleRecords = getAdminBillingRecords(actor, records);

  if (visibleRecords.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-muted">Billing</p>
          <h2 className="font-heading text-3xl font-bold">收费记录</h2>
        </div>
        <p className="rounded-3xl bg-surface p-6 text-sm text-muted shadow-neu-sm">暂无可查看收费记录</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted">Billing</p>
        <h2 className="font-heading text-3xl font-bold">收费记录</h2>
        <p className="mt-2 text-sm text-muted">学生服务周期、缴费周期、到期时间、应收实收。</p>
      </div>

      <div className="rounded-3xl bg-surface p-5 text-sm shadow-neu-sm">
        <p className="font-semibold">收费录入结果</p>
        <p className="mt-2 text-muted">管理员录入收费后，同步更新家长服务有效期与管理端班级核算数据。</p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-surface shadow-neu-sm">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-surfaceAlt text-muted">
            <tr>
              <th className="px-5 py-4 font-semibold">校区</th>
              <th className="px-5 py-4 font-semibold">班级</th>
              <th className="px-5 py-4 font-semibold">学生</th>
              <th className="px-5 py-4 font-semibold">托管类型</th>
              <th className="px-5 py-4 font-semibold">缴费周期</th>
              <th className="px-5 py-4 font-semibold">服务周期</th>
              <th className="px-5 py-4 font-semibold">到期时间</th>
              <th className="px-5 py-4 font-semibold">应收</th>
              <th className="px-5 py-4 font-semibold">实收</th>
            </tr>
          </thead>
          <tbody>
            {visibleRecords.map((record) => (
              <tr key={record.id} className="border-t border-white/70">
                <td className="px-5 py-4">{record.campusName}</td>
                <td className="px-5 py-4">{record.className}</td>
                <td className="px-5 py-4 font-semibold">{record.studentName}</td>
                <td className="px-5 py-4">{record.serviceType}</td>
                <td className="px-5 py-4">{record.billingCycleLabel}</td>
                <td className="px-5 py-4">{record.servicePeriodLabel}</td>
                <td className="px-5 py-4">{record.validUntilLabel}</td>
                <td className="px-5 py-4">{record.amountDueLabel}</td>
                <td className="px-5 py-4">{record.amountPaidLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
