import { AdminAiHighRiskRefusalCard } from '@/components/admin/admin-ai-high-risk-refusal-card';
import { AdminLayout } from '@/components/admin/admin-layout';
import { createHighRiskRefusalCard } from '@/domain/ai-command/high-risk-refusal';
import { DEMO_SEED } from '@/prisma/seed-data';

const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

const highRiskDebtRefusal = createHighRiskRefusalCard({
  intent: 'queryBilling',
  rawInput: '把欠费改成 0',
});

export default function AdminAiAssistantPage() {
  return (
    <AdminLayout actor={actor} campuses={DEMO_SEED.campuses} currentUserName="东城校区管理员">
      <div className="space-y-6">
        <div className="rounded-3xl bg-surface p-6 shadow-neu">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">AI Command Layer</p>
          <h1 className="mt-2 font-heading text-3xl font-bold">AI 经营助手</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            AI 可以协助查询和生成草稿，但涉及收费、余额、欠费、老师课费、毛利、删除学生或批量通知等高风险操作时，必须拒绝并引导到传统页面人工复核。
          </p>
        </div>

        <AdminAiHighRiskRefusalCard card={highRiskDebtRefusal} />
      </div>
    </AdminLayout>
  );
}
