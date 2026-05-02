import { expect, test } from '@playwright/test';

test('parent home presents safety, photo, homework and service validity on 390px mobile without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/parent');

  await expect(page.getByRole('main', { name: '家长移动首页' })).toBeVisible();
  await expect(page.getByRole('region', { name: '家长首页今日概览' })).toContainText('安全到达');
  await expect(page.getByRole('region', { name: '安全到达与照片' })).toContainText('到托照片预览');
  await expect(page.getByRole('region', { name: '今日作业反馈' })).toContainText('作业原图');
  await expect(page.getByRole('region', { name: '服务有效期' })).toContainText('当前服务有效期至 2026-05-31');
  await expect(page.getByRole('link', { name: '查看作业与考勤详情' })).toBeVisible();
  await expect(page.getByText(/余额|欠费金额|应收|实收|毛利|老师课费|1800|amountDue|balanceAmount/)).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);
});
