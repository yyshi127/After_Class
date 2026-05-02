import { expect, test } from '@playwright/test';

test('admin AI assistant presents chat, data cards, confirmation card, refusal and quick questions without desktop overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/admin/ai-assistant');

  await expect(page.getByRole('heading', { name: 'AI 经营助手' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'AI 经营助手对话区' })).toContainText('东城晚辅导本周毛利怎么样？');
  await expect(page.getByRole('region', { name: 'AI 经营数据卡片' })).toContainText('本周预估毛利');
  await expect(page.getByRole('region', { name: 'AI 中风险确认卡片区' })).toContainText('确认后才会执行业务写入');
  await expect(page.getByRole('region', { name: '高风险拒绝卡片' })).toContainText('把欠费改成 0');
  await expect(page.getByRole('region', { name: 'AI 快捷问题' })).toContainText('本周班级毛利排行');

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);
});
