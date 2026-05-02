import { getAdminClassSettlements, type AdminClassSettlementRow } from '@/domain/admin/class-settlements';
import type { PermissionActor } from '@/domain/auth/permissions';

export type AdminClassSettlementsProps = {
  actor: PermissionActor;
  settlements: readonly AdminClassSettlementRow[];
};

export function AdminClassSettlements({ actor, settlements }: AdminClassSettlementsProps) {
  const visibleSettlements = getAdminClassSettlements(actor, settlements);
  const campusOptions = uniqueOptions(visibleSettlements.map((settlement) => [settlement.campusId, settlement.campusName]));
  const classOptions = uniqueOptions(visibleSettlements.map((settlement) => [settlement.classId, settlement.className]));
  const serviceTypeOptions = Array.from(new Set(visibleSettlements.map((settlement) => settlement.serviceType)));
  const teacherOptions = uniqueOptions(
    visibleSettlements.flatMap((settlement) =>
      settlement.teacherUserIds.map((teacherUserId, index) => [teacherUserId, settlement.teacherNames[index] ?? teacherUserId] as const),
    ),
  );

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted">Settlement</p>
        <h2 className="font-heading text-3xl font-bold">班级核算</h2>
        <p className="mt-2 text-sm text-muted">按校区、日期、班级、托管类型、老师筛选收入、课费和毛利。</p>
      </div>

      <div className="grid gap-3 rounded-3xl bg-surface p-4 shadow-neu-sm md:grid-cols-5">
        <label className="space-y-2 text-sm font-semibold text-muted">
          校区
          <select aria-label="校区筛选" className="w-full rounded-2xl bg-surfaceAlt px-3 py-2 text-text shadow-neu-inset" defaultValue="">
            <option value="">全部校区</option>
            {campusOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-semibold text-muted">
          日期
          <input
            aria-label="日期筛选"
            className="w-full rounded-2xl bg-surfaceAlt px-3 py-2 text-text shadow-neu-inset"
            defaultValue={visibleSettlements[0]?.settlementDateLabel ?? ''}
            type="date"
          />
        </label>

        <label className="space-y-2 text-sm font-semibold text-muted">
          班级
          <select aria-label="班级筛选" className="w-full rounded-2xl bg-surfaceAlt px-3 py-2 text-text shadow-neu-inset" defaultValue="">
            <option value="">全部班级</option>
            {classOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-semibold text-muted">
          托管类型
          <select aria-label="托管类型筛选" className="w-full rounded-2xl bg-surfaceAlt px-3 py-2 text-text shadow-neu-inset" defaultValue="">
            <option value="">全部类型</option>
            {serviceTypeOptions.map((serviceType) => (
              <option key={serviceType} value={serviceType}>
                {serviceType}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-semibold text-muted">
          老师
          <select aria-label="老师筛选" className="w-full rounded-2xl bg-surfaceAlt px-3 py-2 text-text shadow-neu-inset" defaultValue="">
            <option value="">全部老师</option>
            {teacherOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visibleSettlements.length === 0 ? (
        <p className="rounded-3xl bg-surface p-6 text-sm text-muted shadow-neu-sm">暂无可查看班级核算</p>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-surface shadow-neu-sm">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-surfaceAlt text-muted">
              <tr>
                <th className="px-5 py-4 font-semibold">校区</th>
                <th className="px-5 py-4 font-semibold">日期</th>
                <th className="px-5 py-4 font-semibold">班级</th>
                <th className="px-5 py-4 font-semibold">托管类型</th>
                <th className="px-5 py-4 font-semibold">老师</th>
                <th className="px-5 py-4 font-semibold">出勤统计</th>
                <th className="px-5 py-4 font-semibold">学生收入</th>
                <th className="px-5 py-4 font-semibold">老师课费</th>
                <th className="px-5 py-4 font-semibold">预留成本</th>
                <th className="px-5 py-4 font-semibold">毛利</th>
              </tr>
            </thead>
            <tbody>
              {visibleSettlements.map((settlement) => (
                <tr key={settlement.id} className="border-t border-white/70">
                  <td className="px-5 py-4">{settlement.campusName}</td>
                  <td className="px-5 py-4">{settlement.settlementDateLabel}</td>
                  <td className="px-5 py-4 font-semibold">{settlement.className}</td>
                  <td className="px-5 py-4">{settlement.serviceType}</td>
                  <td className="px-5 py-4">{settlement.teacherNamesLabel}</td>
                  <td className="px-5 py-4">{settlement.attendanceSummaryLabel}</td>
                  <td className="px-5 py-4">{settlement.studentRevenueAmountLabel}</td>
                  <td className="px-5 py-4">{settlement.teacherFeeAmountLabel}</td>
                  <td className="px-5 py-4">{settlement.reservedCostAmountLabel}</td>
                  <td className="px-5 py-4 font-semibold">{settlement.estimatedGrossProfitAmountLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function uniqueOptions(options: readonly (readonly [string, string])[]): [string, string][] {
  return Array.from(new Map(options).entries());
}
