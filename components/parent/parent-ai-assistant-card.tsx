type ParentAiAssistantCardProps = {
  rawInput: string;
  confirmationSummary: string;
  confirmedStatus: string;
  attendanceStatus: string;
  homeworkStatus: string;
  serviceStatus: string;
};

export function ParentAiAssistantCard({
  rawInput,
  confirmationSummary,
  confirmedStatus,
  attendanceStatus,
  homeworkStatus,
  serviceStatus,
}: ParentAiAssistantCardProps) {
  return (
    <section aria-label="家长 AI 助手" className="rounded-neu bg-surface p-5 shadow-neu sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">Parent AI Assistant</p>
          <h2 className="mt-2 font-heading text-2xl font-bold">家长 AI 助手</h2>
          <p className="mt-2 text-sm leading-6 text-muted">可查询到托、作业和服务有效期；请假等写入动作必须家长确认。</p>
        </div>
        <span className="rounded-full bg-mint/50 px-3 py-1 text-sm font-semibold">确认后执行</span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl bg-surfaceAlt p-4 shadow-neu-inset">
          <label className="text-sm font-bold" htmlFor="parent-ai-text-command">
            输入文字指令
          </label>
          <textarea
            className="mt-3 min-h-24 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm outline-none"
            defaultValue={rawInput}
            id="parent-ai-text-command"
          />
          <div className="mt-3 flex flex-wrap gap-3">
            <button className="min-h-11 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-soft" type="button">
              生成确认卡片
            </button>
            <button className="min-h-11 rounded-full border border-border px-4 py-3 text-sm font-semibold text-muted" type="button">
              按住说话
            </button>
          </div>
        </div>

        <div aria-label="家长 AI 查询结果" className="rounded-3xl bg-background/70 p-4 shadow-neu-sm" role="region">
          <p className="text-sm font-bold">查询结果</p>
          <dl className="mt-3 grid gap-3 text-sm">
            <div className="rounded-2xl bg-surface px-4 py-3">
              <dt className="text-muted">到托状态</dt>
              <dd className="mt-1 font-semibold">{attendanceStatus}</dd>
            </div>
            <div className="rounded-2xl bg-surface px-4 py-3">
              <dt className="text-muted">今日作业</dt>
              <dd className="mt-1 font-semibold">{homeworkStatus}</dd>
            </div>
            <div className="rounded-2xl bg-surface px-4 py-3">
              <dt className="text-muted">服务有效期</dt>
              <dd className="mt-1 font-semibold">{serviceStatus}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section aria-label="家长 AI 请假确认卡片" className="mt-5 rounded-3xl bg-background/80 p-4 shadow-neu-sm">
        <p className="text-sm font-semibold text-primary">AI 请假确认</p>
        <h3 className="mt-2 font-heading text-xl font-bold">请确认 AI 生成的请假申请</h3>
        <div className="mt-4 rounded-2xl bg-surfaceAlt p-4 text-sm leading-6 text-muted">
          <p>原始指令：{rawInput}</p>
          <p>{confirmationSummary}</p>
          <p>确认前不会创建请假记录，也不会通知老师。</p>
          <p>确认后状态：{confirmedStatus}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="min-h-11 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-soft" type="button">
            确认创建请假申请
          </button>
          <button className="min-h-11 rounded-full border border-border px-4 py-3 text-sm font-semibold text-muted" type="button">
            取消本次 AI 建议
          </button>
        </div>
      </section>
    </section>
  );
}
