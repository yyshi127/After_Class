import { expect, test } from '@playwright/test';

test.describe('admin dashboard responsive UI', () => {
  for (const width of [1024, 1440]) {
    test(`renders operations dashboard without horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/admin');

      await expect(page.getByRole('heading', { name: '管理端工作台' })).toBeVisible();
      await expect(page.getByLabel('首页看板校区筛选')).toBeVisible();
      await expect(page.getByRole('region', { name: '关键运营指标' })).toBeVisible();
      await expect(page.getByRole('region', { name: '出勤与毛利趋势' })).toBeVisible();
      await expect(page.getByRole('region', { name: '运营风险' })).toBeVisible();
      await expect(page.getByRole('region', { name: '待处理事项' })).toBeVisible();

      const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(hasHorizontalOverflow).toBe(false);
    });
  }
});
