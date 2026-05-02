import { AlertCircle, BarChart3, CheckCircle2, Clock, WalletCards } from 'lucide-react';

export type AdminDashboardMetrics = {
  arrivalsToday: number;
  attendanceRate: number | null;
  pendingHomeworkFeedback: number;
  expiringServices: number;
  estimatedGrossProfitCents: number | null;
};

type AdminDashboardProps = {
  metrics: AdminDashboardMetrics;
};

function formatPercent(value: number | null) {
  return value == null ? '—' : `${Math.round(value * 100)}%`;
}

function formatCurrency(cents: number | null) {
  return cents == null ? '—' : `¥${(cents / 100).toLocaleString('zh-CN')}`;
}

export function AdminDashboard({ metrics }: AdminDashboardProps) {
  const cards = [
    {
      title: '今日到托',
      value: metrics.arrivalsToday.toString(),
      empty: metrics.arrivalsToday === 0 ? '暂无到托记录' : null,
      icon: CheckCircle2,
    },
    {
      title: '出勤率',
      value: formatPercent(metrics.attendanceRate),
      empty: metrics.attendanceRate == null ? '暂无出勤数据' : null,
      icon: BarChart3,
    },
    {
      title: '作业待反馈',
      value: metrics.pendingHomeworkFeedback.toString(),
      empty: metrics.pendingHomeworkFeedback === 0 ? '暂无待反馈作业' : null,
      icon: AlertCircle,
    },
    {
      title: '服务到期',
      value: metrics.expiringServices.toString(),
      empty: metrics.expiringServices === 0 ? '暂无到期提醒' : null,
      icon: Clock,
    },
    {
      title: '预估毛利',
      value: formatCurrency(metrics.estimatedGrossProfitCents),
      empty: metrics.estimatedGrossProfitCents == null ? '暂无核算数据' : null,
      icon: WalletCards,
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted">Dashboard</p>
        <h2 className="font-heading text-3xl font-bold">今日运营看板</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.title} className="rounded-3xl bg-surface p-5 shadow-neu-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-muted">{card.title}</h3>
                <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold">{card.value}</p>
              {card.empty ? <p className="mt-3 text-sm text-muted">{card.empty}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
