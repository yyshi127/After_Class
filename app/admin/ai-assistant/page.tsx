import { AdminAiAssistantWorkspace } from '@/components/admin/admin-ai-assistant-workspace';
import { AdminLayout } from '@/components/admin/admin-layout';
import { createHighRiskRefusalCard } from '@/domain/ai-command/high-risk-refusal';
import { DEMO_SEED } from '@/prisma/seed-data';

const actor = { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' as const, campusIds: ['demo-campus-east'] };

const highRiskDebtRefusal = createHighRiskRefusalCard({
  intent: 'queryBilling',
  rawInput: '把欠费改成 0',
});

const conversation = [
  { id: 'msg-admin', role: 'user' as const, content: '东城晚辅导本周毛利怎么样？', timeLabel: '17:42' },
  { id: 'msg-ai', role: 'assistant' as const, content: '已按校区权限汇总班级核算，可查看右侧数据卡片。', timeLabel: '17:42' },
];

const dataCards = [
  { id: 'gross-profit', label: '本周预估毛利', value: '¥8,420', helper: '仅管理端可见', tone: 'success' as const },
  { id: 'pending-confirm', label: '待确认 AI 动作', value: '3', helper: '中风险写入需人工确认', tone: 'warning' as const },
  { id: 'audit-logs', label: '今日 AI 日志', value: '18', helper: '所有调用均已留痕', tone: 'info' as const },
];

const quickQuestions = ['查询今日出勤异常', '本周班级毛利排行', '查看待确认 AI 操作'];

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

        <AdminAiAssistantWorkspace
          conversation={conversation}
          dataCards={dataCards}
          quickQuestions={quickQuestions}
          refusalCard={highRiskDebtRefusal}
        />
      </div>
    </AdminLayout>
  );
}
