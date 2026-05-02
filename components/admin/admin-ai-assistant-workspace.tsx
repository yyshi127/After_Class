import { Bot, CheckCircle2, Clock3, MessageCircle, ShieldAlert, Sparkles, XCircle } from 'lucide-react';

import { AdminAiHighRiskRefusalCard } from '@/components/admin/admin-ai-high-risk-refusal-card';
import type { HighRiskRefusalCard } from '@/domain/ai-command/high-risk-refusal';

type AiConversationMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timeLabel: string;
};

type AiAssistantDataCard = {
  id: string;
  label: string;
  value: string;
  helper: string;
  tone: 'success' | 'warning' | 'info';
};

type AdminAiAssistantWorkspaceProps = {
  conversation: readonly AiConversationMessage[];
  dataCards: readonly AiAssistantDataCard[];
  quickQuestions: readonly string[];
  refusalCard: HighRiskRefusalCard;
};

const dataCardToneClasses: Record<AiAssistantDataCard['tone'], string> = {
  success: 'bg-success/20 text-success',
  warning: 'bg-peach/35 text-primary-deep',
  info: 'bg-primary/15 text-primary-deep',
};

export function AdminAiAssistantWorkspace({
  conversation,
  dataCards,
  quickQuestions,
  refusalCard,
}: AdminAiAssistantWorkspaceProps) {
  return (
    <div data-testid="admin-ai-assistant-shell" className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr] xl:items-start">
      <section aria-label="AI 经营助手对话区" className="min-w-0 rounded-[2rem] bg-surface p-5 shadow-neu">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Copilot Console</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-text">对话与操作编排</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              AI 只负责查询、草稿和建议；中风险写入必须确认，高风险操作直接拒绝并保留审计线索。
            </p>
          </div>
          <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm font-bold text-primary-deep">
            <Bot aria-hidden="true" className="h-4 w-4" />
            权限已校验
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {conversation.map((message) => {
            const isUser = message.role === 'user';

            return (
              <article
                key={message.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                aria-label={isUser ? '管理员消息' : 'AI 助手消息'}
              >
                {!isUser ? (
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-lavender/50 text-primary-deep shadow-neu-sm">
                    <Sparkles aria-hidden="true" className="h-4 w-4" />
                  </span>
                ) : null}
                <div
                  className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-neu-sm ${
                    isUser ? 'bg-primary text-white' : 'bg-surfaceAlt text-text'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`mt-2 text-xs ${isUser ? 'text-white/80' : 'text-muted'}`}>{message.timeLabel}</p>
                </div>
              </article>
            );
          })}
        </div>

        <section aria-label="AI 快捷问题" className="mt-6 rounded-3xl bg-surfaceAlt p-4 shadow-neu-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-text">
            <MessageCircle aria-hidden="true" className="h-4 w-4 text-primary" />
            快捷问题
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickQuestions.map((question) => (
              <button
                key={question}
                className="min-h-11 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-text shadow-neu-sm transition hover:text-primary-deep"
                type="button"
              >
                {question}
              </button>
            ))}
          </div>
        </section>
      </section>

      <div className="min-w-0 space-y-6">
        <section aria-label="AI 经营数据卡片" className="rounded-[2rem] bg-surface p-5 shadow-neu">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Data Cards</p>
              <h2 className="mt-2 font-heading text-xl font-bold">经营数据卡片</h2>
            </div>
            <span className="rounded-full bg-surfaceAlt px-3 py-2 text-xs font-bold text-muted shadow-neu-sm">仅管理端</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {dataCards.map((card) => (
              <article key={card.id} className="rounded-3xl bg-surfaceAlt p-4 shadow-neu-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-muted">{card.label}</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-text">{card.value}</p>
                    <p className="mt-1 text-sm text-muted">{card.helper}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${dataCardToneClasses[card.tone]}`}>AI</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-label="AI 中风险确认卡片区" className="rounded-[2rem] bg-surface p-5 shadow-neu">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-peach/35 text-primary-deep shadow-neu-sm">
              <Clock3 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Medium Risk</p>
              <h2 className="mt-2 font-heading text-xl font-bold">AI 中风险确认卡片</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                <span>确认后才会执行业务写入</span>，确认前不会修改请假、留言、点评或练习单数据。
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-3xl bg-surfaceAlt p-4 shadow-neu-sm">
            <p className="text-sm font-bold text-text">示例：向家长发布续费提醒草稿</p>
            <p className="mt-2 text-sm leading-6 text-muted">AI 已生成草稿，需有权限管理员确认后才能进入通知发送流程。</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white shadow-neu-sm" type="button">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                确认执行示例
              </button>
              <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-5 py-2 text-sm font-bold text-muted shadow-neu-sm" type="button">
                <XCircle aria-hidden="true" className="h-4 w-4" />
                取消
              </button>
            </div>
          </div>
        </section>

        <div className="rounded-[2rem] bg-surface p-2 shadow-neu">
          <div className="mb-3 flex items-center gap-2 px-3 pt-3 text-sm font-bold text-red-700">
            <ShieldAlert aria-hidden="true" className="h-4 w-4" />
            高风险拒绝示例
          </div>
          <AdminAiHighRiskRefusalCard card={refusalCard} />
        </div>
      </div>
    </div>
  );
}
