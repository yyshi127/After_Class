import { expect, test } from '@playwright/test';

for (const viewport of [
  { name: 'tablet', width: 768, height: 900 },
  { name: 'mobile', width: 390, height: 900 },
]) {
  test(`teacher homework correction workspace is usable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/teacher/homework-correction');

    await expect(page.getByRole('main', { name: '老师作业批改工作台' })).toBeVisible();
    await expect(page.getByRole('region', { name: '作业图片与圈错区' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'AI 圈错确认区' })).toBeVisible();
    await expect(page.getByRole('region', { name: '三类点评编辑区' })).toBeVisible();
    await expect(page.getByRole('region', { name: '发布与练习单操作区' })).toBeVisible();

    await expect(page.getByRole('button', { name: '确认区域' })).toBeVisible();
    await expect(page.getByRole('button', { name: '发布给家长' })).toBeVisible();
    await expect(page.getByRole('link', { name: '进入练习单生成' })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalOverflow).toBe(false);
  });
}
