import type { ParentSafetyArrivalCard } from '@/domain/parent/safety-arrival';

function formatArrivalTime(checkedAt: Date | null): string {
  if (!checkedAt) {
    return '待确认';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai',
  }).format(checkedAt);
}

export function ParentHomeSafetyCard({ cards }: { cards: readonly ParentSafetyArrivalCard[] }) {
  return (
    <section aria-label="安全到达与照片" className="rounded-neu bg-surface p-5 shadow-neu sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">Arrival Safety</p>
          <h2 className="font-heading text-2xl font-bold">安全到达</h2>
        </div>
        <span className="rounded-full bg-surfaceAlt px-3 py-1 text-sm text-muted">家长可见</span>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl bg-surfaceAlt p-4 text-muted shadow-neu-sm">暂无孩子到托记录</div>
      ) : (
        <div className="grid gap-4">
          {cards.map((card) => (
            <article key={card.studentId} className="overflow-hidden rounded-2xl bg-surfaceAlt p-4 shadow-neu-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-xl font-semibold">{card.studentName}</h3>
                  <p className="mt-2 text-sm text-muted">到托时间：{formatArrivalTime(card.checkedAt)}</p>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-sm font-semibold">{card.status}</span>
              </div>
              <p className="mt-3 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold">{card.status === '已到' ? '已到托管中心' : card.status}</p>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                <div className="rounded-2xl bg-background/70 p-4 shadow-neu-inset">
                  <p className="text-sm font-bold">到托照片预览</p>
                  <p className="mt-2 break-all text-sm text-muted">照片：{card.photoFileId ?? '待上传'}</p>
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-surface p-4">
                    <dt className="text-muted">托管类型</dt>
                    <dd className="mt-1 font-medium">{card.serviceType}</dd>
                  </div>
                  <div className="rounded-2xl bg-surface p-4">
                    <dt className="text-muted">负责老师</dt>
                    <dd className="mt-1 font-medium">{card.teacherName}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
