import type { ParentVisibleServiceValidity } from '@/domain/billing/service-validity';

export function ParentServiceValidityCard({ validities }: { validities: readonly ParentVisibleServiceValidity[] }) {
  return (
    <section className="rounded-neu bg-surface p-6 shadow-neu">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">Service Validity</p>
          <h2 className="font-heading text-2xl font-bold">服务有效期</h2>
        </div>
        <span className="rounded-full bg-surfaceAlt px-3 py-1 text-sm text-muted">仅展示有效期</span>
      </div>

      {validities.length === 0 ? (
        <div className="rounded-2xl bg-surfaceAlt p-4 text-muted shadow-neu-sm">暂无服务有效期记录</div>
      ) : (
        <div className="grid gap-4">
          {validities.map((validity) => (
            <article key={validity.studentId} className="rounded-2xl bg-surfaceAlt p-4 shadow-neu-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-xl font-semibold">{validity.studentName}</h3>
                  <p className="mt-2 text-sm text-muted">{validity.serviceType}</p>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-sm font-semibold">家长可见</span>
              </div>
              <p className="mt-3 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold">{validity.statusLabel}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
