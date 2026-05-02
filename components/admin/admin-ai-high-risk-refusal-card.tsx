import type { HighRiskRefusalCard } from '@/domain/ai-command/high-risk-refusal';

type AdminAiHighRiskRefusalCardProps = {
  card: HighRiskRefusalCard;
};

export function AdminAiHighRiskRefusalCard({ card }: AdminAiHighRiskRefusalCardProps) {
  return (
    <section
      aria-label="高风险拒绝卡片"
      className="rounded-3xl border border-red-200/80 bg-red-50/80 p-6 shadow-neu"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">High Risk Refused</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-red-900">{card.title}</h2>
          <p className="mt-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-red-950 shadow-neu-sm">
            {card.rawInput}
          </p>
        </div>
        <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">AI 不可执行</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="rounded-2xl bg-white/70 p-4 shadow-neu-sm">
          <p className="text-sm font-bold text-red-900">不能执行原因</p>
          <p className="mt-2 text-sm leading-6 text-red-800">{card.reason}</p>
          <p className="mt-3 text-sm font-semibold text-red-900">{card.safetyNote}</p>
        </div>

        <a
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-neu-sm transition hover:bg-red-800"
          href={card.traditionalPage.href}
        >
          {card.traditionalPage.label}
        </a>
      </div>
    </section>
  );
}
