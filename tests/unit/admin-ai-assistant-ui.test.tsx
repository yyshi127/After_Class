import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminAiAssistantWorkspace } from '@/components/admin/admin-ai-assistant-workspace';
import { createHighRiskRefusalCard } from '@/domain/ai-command/high-risk-refusal';

const refusalCard = createHighRiskRefusalCard({ intent: 'queryBilling', rawInput: '把欠费改成 0' });

const conversation = [
  { id: 'msg-admin', role: 'user' as const, content: '东城晚辅导本周毛利怎么样？', timeLabel: '17:42' },
  { id: 'msg-ai', role: 'assistant' as const, content: '已按校区权限汇总班级核算，可查看右侧数据卡片。', timeLabel: '17:42' },
];

const dataCards = [
  { id: 'gross-profit', label: '本周预估毛利', value: '¥8,420', helper: '仅管理端可见', tone: 'success' as const },
  { id: 'pending-confirm', label: '待确认 AI 动作', value: '3', helper: '中风险写入需人工确认', tone: 'warning' as const },
];

const quickQuestions = ['查询今日出勤异常', '本周班级毛利排行', '查看待确认 AI 操作'];

describe('admin AI assistant workspace UI', () => {
  it('shows chat, admin data cards, confirmation area, refusal card and quick questions', () => {
    render(
      <AdminAiAssistantWorkspace
        conversation={conversation}
        dataCards={dataCards}
        quickQuestions={quickQuestions}
        refusalCard={refusalCard}
      />,
    );

    expect(screen.getByRole('region', { name: 'AI 经营助手对话区' })).toBeInTheDocument();
    expect(screen.getByText('东城晚辅导本周毛利怎么样？')).toBeInTheDocument();
    expect(screen.getByText('已按校区权限汇总班级核算，可查看右侧数据卡片。')).toBeInTheDocument();

    const dataRegion = screen.getByRole('region', { name: 'AI 经营数据卡片' });
    expect(within(dataRegion).getByText('本周预估毛利')).toBeInTheDocument();
    expect(within(dataRegion).getByText('¥8,420')).toBeInTheDocument();
    expect(within(dataRegion).getByText('仅管理端可见')).toBeInTheDocument();
    expect(within(dataRegion).getByText('待确认 AI 动作')).toBeInTheDocument();

    const confirmationRegion = screen.getByRole('region', { name: 'AI 中风险确认卡片区' });
    expect(within(confirmationRegion).getByText('确认后才会执行业务写入')).toBeInTheDocument();
    expect(within(confirmationRegion).getByRole('button', { name: '确认执行示例' })).toHaveClass('min-h-11');
    expect(within(confirmationRegion).getByRole('button', { name: '取消' })).toHaveClass('min-h-11');

    expect(screen.getByRole('region', { name: '高风险拒绝卡片' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'AI 快捷问题' })).toHaveTextContent('本周班级毛利排行');
  });

  it('keeps the assistant shell responsive for desktop admin use', () => {
    render(
      <AdminAiAssistantWorkspace
        conversation={conversation}
        dataCards={dataCards}
        quickQuestions={quickQuestions}
        refusalCard={refusalCard}
      />,
    );

    expect(screen.getByTestId('admin-ai-assistant-shell')).toHaveClass('xl:grid-cols-[1.35fr_0.85fr]');
    expect(screen.getByRole('region', { name: 'AI 经营助手对话区' })).toHaveClass('min-w-0');
  });
});
