import { AlertCircle, BarChart3, CheckCircle2, Clock, ListChecks, TrendingUp, WalletCards } from 'lucide-react';

export type AdminDashboardMetrics = {
  arrivalsToday: number;
  attendanceRate: number | null;
  pendingHomeworkFeedback: number;
  expiringServices: number;
  estimatedGrossProfitCents: number | null;
};

export type AdminDashboardCampusOption = {
  id: string;
  name: string;
};

export type AdminDashboardTrendPoint = {
  label: string;
  attendanceRate: number;
  grossProfitCents: number;
};

export type AdminDashboardRiskItem = {
  id: string;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  owner: string;
  dueLabel: string;
};

export type AdminDashboardTodoItem = {
  id: string;
  title: string;
  href: string;
};

type AdminDashboardProps = {
  metrics: AdminDashboardMetrics;
  campusOptions?: readonly AdminDashboardCampusOption[];
  trendPoints?: readonly AdminDashboardTrendPoint[];
  riskItems?: readonly AdminDashboardRiskItem[];
  todoItems?: readonly AdminDashboardTodoItem[];
};

function formatPercent(value: number | null) {
  return value == null ? '—' : `${Math.round(value * 100)}%`;
}

function formatCurrency(cents: number | null) {
  return cents == null ? '—' : `¥${(cents / 100).toLocaleString('zh-CN')}`;
}

const severityLabels: Record<AdminDashboardRiskItem['severity'], string> = {
  HIGH: '高风险',
  MEDIUM: '需关注',
  LOW: '观察中',
};

export function AdminDashboard({
  metrics,
  campusOptions = [{ id: 'all', name: '全部校区' }],
  trendPoints = [],
  riskItems = [],
  todoItems = [],
}: AdminDashboardProps) {
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
      <div className="flex flex-col gap-4 rounded-[2rem] bg-surface p-5 shadow-neu md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted">Dashboard</p>
          <h2 className="font-heading text-3xl font-bold">今日运营看板</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">用一个页面跟进 KPI、趋势、风险和待处理事项，先保证机构每天不用 AI 也能完成运营闭环。</p>
        </div>

        <div aria-label="首页看板校区筛选" className="flex flex-wrap gap-2">
          {campusOptions.map((campus, index) => (
            <button
              key={campus.id}
              className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold shadow-neu-sm ${
                index === 0 ? 'bg-primary text-white' : 'bg-surfaceAlt text-text'
              }`}
              type="button"
            >
              {campus.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]" data-testid="admin-dashboard-shell">
        <div className="space-y-6 min-w-0">
          <section aria-label="关键运营指标" className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
          </section>

          <section aria-label="出勤与毛利趋势" className="min-w-0 rounded-[2rem] bg-surface p-5 shadow-neu-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-primary/15 p-3 text-primary">
                <TrendingUp aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold">出勤与毛利趋势</h3>
                <p className="text-sm text-muted">按周追踪出勤率和预估毛利，异常波动进入风险跟进。</p>
              </div>
            </div>

            {trendPoints.length === 0 ? (
              <p className="mt-6 rounded-3xl bg-surfaceAlt p-5 text-sm text-muted">暂无趋势数据</p>
            ) : (
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {trendPoints.map((point) => (
                  <article key={point.label} className="rounded-3xl bg-surfaceAlt p-4 shadow-neu-sm">
                    <p className="text-sm font-semibold text-muted">{point.label}</p>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted">出勤率</p>
                        <p className="text-2xl font-bold">{formatPercent(point.attendanceRate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted">预估毛利</p>
                        <p className="text-lg font-bold text-primaryDeep">{formatCurrency(point.grossProfitCents)}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6 min-w-0">
          <section aria-label="运营风险" className="rounded-[2rem] bg-surface p-5 shadow-neu-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-danger/10 p-3 text-danger">
                <AlertCircle aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="font-heading text-xl font-bold">运营风险</h3>
            </div>
            {riskItems.length === 0 ? (
              <p className="mt-5 rounded-3xl bg-surfaceAlt p-4 text-sm text-muted">暂无风险事项</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {riskItems.map((item) => (
                  <li key={item.id} className="rounded-3xl bg-surfaceAlt p-4 shadow-neu-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{item.title}</p>
                      <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">{severityLabels[item.severity]}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted">{item.owner} · {item.dueLabel}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label="待处理事项" className="rounded-[2rem] bg-surface p-5 shadow-neu-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-success/10 p-3 text-success">
                <ListChecks aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="font-heading text-xl font-bold">待处理事项</h3>
            </div>
            {todoItems.length === 0 ? (
              <p className="mt-5 rounded-3xl bg-surfaceAlt p-4 text-sm text-muted">暂无待处理事项</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {todoItems.map((item) => (
                  <li key={item.id}>
                    <a className="block min-h-11 rounded-3xl bg-surfaceAlt p-4 text-sm font-semibold shadow-neu-sm transition hover:text-primary" href={item.href}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
