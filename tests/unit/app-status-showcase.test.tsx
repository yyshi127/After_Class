import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppStatusShowcasePage, getAppStatusItems } from '@/components/app-status-showcase';

describe('app status showcase', () => {
  it('defines the required global UI states with accessible labels and actions', () => {
    const items = getAppStatusItems();

    expect(items.map((item) => item.label)).toEqual([
      '加载中',
      '空状态',
      '错误状态',
      '无权限',
      'AI 思考中',
      '语音录入中',
    ]);
    expect(items.every((item) => item.role === 'status' || item.role === 'alert')).toBe(true);
    expect(items.find((item) => item.label === '错误状态')?.role).toBe('alert');
    expect(items.find((item) => item.label === '无权限')?.actionLabel).toBe('返回首页');
    expect(items.find((item) => item.label === '语音录入中')?.actionLabel).toBe('结束录音');
  });

  it('renders loading, empty, error, permission denied, AI thinking and voice recording states', () => {
    render(<AppStatusShowcasePage />);

    expect(screen.getByRole('heading', { name: '全局状态页面' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: '加载中' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: '空状态' })).toBeInTheDocument();
    expect(screen.getByRole('alert', { name: '错误状态' })).toBeInTheDocument();
    expect(screen.getByRole('alert', { name: '无权限' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'AI 思考中' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: '语音录入中' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '重试' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '结束录音' })).toBeInTheDocument();
  });
});
