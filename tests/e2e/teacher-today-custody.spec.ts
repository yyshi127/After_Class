import { expect, test } from '@playwright/test';

test('teacher today custody page shows assigned students and filters', async ({ page }) => {
  await page.goto('/teacher');

  await expect(page.getByRole('heading', { name: '今日托管' })).toBeVisible();
  await expect(page.getByLabel('校区筛选')).toBeVisible();
  await expect(page.getByLabel('班级筛选')).toBeVisible();
  await expect(page.getByLabel('托管类型筛选')).toBeVisible();
  await expect(page.getByRole('heading', { name: '王小明' })).toBeVisible();
  await expect(page.getByText('待确认')).toBeVisible();
  await expect(page.getByText('服务 7 天内到期')).toBeVisible();
  await expect(page.getByRole('heading', { name: '服务到期提醒' })).toBeVisible();
  await expect(page.getByText('王小明 · 服务 4 天后到期')).toBeVisible();
  await expect(page.getByText(/毛利|余额|欠费金额|收入|课费|¥|1800/)).toHaveCount(0);
  await expect(page.getByText('赵小西')).toHaveCount(0);
});
