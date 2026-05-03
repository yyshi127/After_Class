import { expect, test } from '@playwright/test';

test('global status page shows all required states on mobile without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/status');

  await expect(page.getByRole('heading', { name: '全局状态页面' })).toBeVisible();
  await expect(page.getByRole('status', { name: '加载中' })).toBeVisible();
  await expect(page.getByRole('status', { name: '空状态' })).toBeVisible();
  await expect(page.getByRole('alert', { name: '错误状态' })).toBeVisible();
  await expect(page.getByRole('alert', { name: '无权限' })).toBeVisible();
  await expect(page.getByRole('status', { name: 'AI 思考中' })).toBeVisible();
  await expect(page.getByRole('status', { name: '语音录入中' })).toBeVisible();
  await expect(page.getByRole('button', { name: '重试' })).toBeVisible();
  await expect(page.getByRole('button', { name: '结束录音' })).toBeVisible();

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(horizontalOverflow).toBe(false);
});
