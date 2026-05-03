import { expect, test } from '@playwright/test';

test('parent profile service page shows masked child info, notifications, leave records and safe validity on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/parent/profile');

  await expect(page.getByRole('heading', { name: '我的与服务' })).toBeVisible();
  await expect(page.getByText('王小明')).toBeVisible();
  await expect(page.getByRole('region', { name: '王小明孩子信息' })).toContainText('3101********3218');
  await expect(page.getByRole('region', { name: '王小明通知设置' })).toContainText('到托/离校通知：已开启');
  await expect(page.getByRole('region', { name: '王小明请假记录' })).toContainText('2026-05-04 · 晚辅导 · 已确认');
  await expect(page.getByText('有效至 2026-05-31')).toBeVisible();

  await expect(page.getByText(/310101201001013218|欠费|余额|应收|已收|课消|教师费用|毛利/)).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);
});
