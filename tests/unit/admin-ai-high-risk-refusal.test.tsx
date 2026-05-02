import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminAiHighRiskRefusalCard } from '@/components/admin/admin-ai-high-risk-refusal-card';
import { createHighRiskRefusalCard } from '@/domain/ai-command/high-risk-refusal';

describe('admin AI high-risk refusal UI', () => {
  it('refuses changing debt to zero and points admin to the billing page', () => {
    const card = createHighRiskRefusalCard({ intent: 'queryBilling', rawInput: '把欠费改成 0' });

    expect(card).toMatchObject({
      risk: 'HIGH',
      rejected: true,
      title: 'AI 已拒绝执行高风险操作',
      reason: '高风险动作禁止由 AI 执行，请转到传统页面并由有权限人员人工复核',
      traditionalPage: {
        label: '前往收费记录页人工复核',
        href: '/admin/billing',
      },
    });
    expect(card.executableByAi).toBe(false);

    render(<AdminAiHighRiskRefusalCard card={card} />);

    expect(screen.getByRole('heading', { name: 'AI 已拒绝执行高风险操作' })).toBeInTheDocument();
    expect(screen.getByText('把欠费改成 0')).toBeInTheDocument();
    expect(screen.getByText('不能执行原因')).toBeInTheDocument();
    expect(screen.getByText('高风险动作禁止由 AI 执行，请转到传统页面并由有权限人员人工复核')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '前往收费记录页人工复核' })).toHaveAttribute('href', '/admin/billing');
    expect(screen.getByText('AI 不会修改收费、余额、欠费、老师课费或毛利数据。')).toBeInTheDocument();
  });
});
