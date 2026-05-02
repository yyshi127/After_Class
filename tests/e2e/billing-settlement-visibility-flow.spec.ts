import { expect, test } from '@playwright/test';

test('收费与核算可见性流程按角色隔离字段', async ({ page }) => {
  await page.goto('/admin/billing');
  await expect(page.getByRole('heading', { name: '收费记录' })).toBeVisible();
  await expect(page.getByText('收费录入结果')).toBeVisible();
  await expect(page.getByText('王小明')).toBeVisible();
  await expect(page.getByText('¥1800.00').first()).toBeVisible();
  await expect(page.getByText('西城托管中心')).toHaveCount(0);

  await page.goto('/parent');
  await expect(page.getByRole('heading', { name: '服务有效期' })).toBeVisible();
  await expect(page.getByText('当前服务有效期至 2026-05-31')).toBeVisible();
  await expect(page.getByText('余额')).toHaveCount(0);
  await expect(page.getByText('欠费')).toHaveCount(0);
  await expect(page.getByText('应收')).toHaveCount(0);
  await expect(page.getByText('实收')).toHaveCount(0);
  await expect(page.getByText('毛利')).toHaveCount(0);

  await page.goto('/teacher');
  await expect(page.getByRole('heading', { name: '服务到期提醒' })).toBeVisible();
  await expect(page.getByText('王小明 · 服务 4 天后到期')).toBeVisible();
  await expect(page.getByText('毛利')).toHaveCount(0);
  await expect(page.getByText('¥')).toHaveCount(0);

  await page.goto('/admin/settlements');
  await expect(page.getByRole('heading', { name: '班级核算' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '东城三年级晚辅 A 班' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '毛利' })).toBeVisible();
  await expect(page.getByText('-¥160.00')).toBeVisible();
  await expect(page.getByText('西城托管中心')).toHaveCount(0);
});
