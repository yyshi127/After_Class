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
    <section className="rounded-neu bg-surface p-6 shadow-neu">
      <div className="mb-4 flex items-center justify-between gap-4">
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
            <article key={card.studentId} className="rounded-2xl bg-surfaceAlt p-4 shadow-neu-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-xl font-semibold">{card.studentName}</h3>
                  <p className="mt-2 text-sm text-muted">到托时间：{formatArrivalTime(card.checkedAt)}</p>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-sm font-semibold">{card.status}</span>
              </div>
              <p className="mt-3 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold">{card.status === '已到' ? '已到托管中心' : card.status}</p>

              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                <div>
                  <dt className="text-muted">托管类型</dt>
                  <dd className="font-medium">{card.serviceType}</dd>
                </div>
                <div>
                  <dt className="text-muted">负责老师</dt>
                  <dd className="font-medium">{card.teacherName}</dd>
                </div>
                <div>
                  <dt className="text-muted">到托照片</dt>
                  <dd className="font-medium">照片：{card.photoFileId ?? '待上传'}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
