import { expect, test } from '@playwright/test';

test('teacher today custody page shows assigned students and filters', async ({ page }) => {
  await page.goto('/teacher');

  await expect(page.getByRole('heading', { name: '今日托管' })).toBeVisible();
  await expect(page.getByRole('region', { name: '今日托管学生列表' })).toBeVisible();
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

test('teacher today custody page is usable on tablet and mobile H5', async ({ page }) => {
  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/teacher');

    await expect(page.getByRole('region', { name: '老师 AI 快捷录入' })).toContainText('AI 不会直接发布给家长');
    await expect(page.getByRole('button', { name: 'AI 快捷录入' })).toBeVisible();
    await expect(page.getByRole('link', { name: '为王小明拍照签到' })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalOverflow).toBe(false);
  }
});
