import { expect, test } from '@playwright/test';

test('home page renders development environment smoke screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '智能晚辅托管系统开发环境已就绪' })).toBeVisible();
});
