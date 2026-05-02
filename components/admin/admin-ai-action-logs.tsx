import { AdminDataTableFrame } from '@/components/admin/admin-data-table-frame';
import type { AdminAiActionLogListItem } from '@/domain/admin/ai-action-logs';

const intentOptions = ['全部意图', '考勤查询', '作业查询', '请假申请', '服务有效期/收费查询', '留言老师', '反馈草稿', '圈错建议', '同类题生成', '班级核算查询'];
const riskOptions = ['全部风险', '低风险', '中风险', '高风险'];
const confirmationOptions = ['全部确认状态', '无需确认', '待确认', '已确认'];
const resultOptions = ['全部结果', '已生成草稿', '待确认', '已执行', '已拒绝', '失败'];

type AdminAiActionLogsProps = {
  logs: readonly AdminAiActionLogListItem[];
  isLoading?: boolean;
  errorMessage?: string;
};

export function AdminAiActionLogs({ logs, isLoading = false, errorMessage }: AdminAiActionLogsProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-surface p-6 shadow-neu">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">AI Audit</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">AI 操作日志</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          记录 AI 查询、草稿、确认、拒绝和失败结果，便于校区按权限追溯每次 AI 操作，确认 AI 没有绕过业务服务或权限边界。
        </p>
      </div>

      <div className="grid gap-3 rounded-3xl bg-surface p-5 shadow-neu md:grid-cols-2 xl:grid-cols-6">
        <label className="space-y-2 text-sm font-semibold text-muted">
          时间筛选
          <input aria-label="时间筛选" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-3 text-text shadow-neu-inset" defaultValue="2026-05-03" type="date" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          用户筛选
          <input aria-label="用户筛选" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-3 text-text shadow-neu-inset" placeholder="姓名或用户 ID" type="search" />
        </label>
        <FilterSelect label="意图筛选" options={intentOptions} />
        <FilterSelect label="风险筛选" options={riskOptions} />
        <FilterSelect label="确认状态筛选" options={confirmationOptions} />
        <FilterSelect label="结果筛选" options={resultOptions} />
      </div>

      <AdminDataTableFrame
        emptyMessage="暂无符合权限或筛选条件的 AI 操作日志"
        errorMessage={errorMessage}
        isLoading={isLoading}
        itemLabel="日志资料"
        minWidthClassName="min-w-[980px]"
        title="日志资料表格"
        totalCount={logs.length}
      >
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-surfaceAlt text-xs uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">时间</th>
                <th className="px-4 py-3 font-semibold">校区</th>
                <th className="px-4 py-3 font-semibold">用户</th>
                <th className="px-4 py-3 font-semibold">意图</th>
                <th className="px-4 py-3 font-semibold">风险</th>
                <th className="px-4 py-3 font-semibold">确认状态</th>
                <th className="px-4 py-3 font-semibold">结果</th>
                <th className="px-4 py-3 font-semibold">原始输入</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                  <tr key={log.id} className="border-t border-white/70">
                    <td className="px-4 py-4 font-medium">{log.createdAtLabel}</td>
                    <td className="px-4 py-4">{log.campusLabel}</td>
                    <td className="px-4 py-4">{log.actorLabel}</td>
                    <td className="px-4 py-4">{log.intentLabel}</td>
                    <td className="px-4 py-4"><StatusPill tone={log.risk}>{log.riskLabel}</StatusPill></td>
                    <td className="px-4 py-4">{log.confirmationStatusLabel}</td>
                    <td className="px-4 py-4">{log.resultStatusLabel}</td>
                    <td className="max-w-xs px-4 py-4 text-muted">{log.rawInput}</td>
                  </tr>
                ))}
            </tbody>
          </table>
      </AdminDataTableFrame>
    </section>
  );
}

function FilterSelect({ label, options }: { label: string; options: readonly string[] }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-muted">
      {label}
      <select aria-label={label} className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-3 text-text shadow-neu-inset" defaultValue={options[0]}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function StatusPill({ tone, children }: { tone: 'LOW' | 'MEDIUM' | 'HIGH'; children: string }) {
  const toneClass = tone === 'HIGH' ? 'bg-danger/15 text-danger' : tone === 'MEDIUM' ? 'bg-peach/40 text-text' : 'bg-mint/50 text-text';
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>{children}</span>;
}
