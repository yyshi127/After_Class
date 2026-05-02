import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ParentAiAssistantCard } from '@/components/parent/parent-ai-assistant-card';

describe('parent AI assistant card', () => {
  it('renders text and voice entries, query results, and clear confirmation actions', () => {
    render(
      <ParentAiAssistantCard
        attendanceStatus="已到托管中心，可查看到托照片"
        confirmationSummary="王小明 2026-05-04 晚辅导请假，原因：孩子发烧"
        confirmedStatus="请假"
        homeworkStatus="今日作业反馈已发布"
        rawInput="明天晚辅导请假，孩子发烧"
        serviceStatus="有效至 2026-05-31"
      />,
    );

    expect(screen.getByRole('region', { name: '家长 AI 助手' })).toBeInTheDocument();
    expect(screen.getByLabelText('输入文字指令')).toHaveValue('明天晚辅导请假，孩子发烧');
    expect(screen.getByRole('button', { name: '生成确认卡片' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '按住说话' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '家长 AI 查询结果' })).toHaveTextContent('今日作业反馈已发布');
    expect(screen.getByRole('region', { name: '家长 AI 请假确认卡片' })).toHaveTextContent('确认前不会创建请假记录');
    expect(screen.getByRole('button', { name: '确认创建请假申请' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消本次 AI 建议' })).toBeInTheDocument();
  });
});
