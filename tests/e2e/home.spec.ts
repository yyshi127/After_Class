import { expect, test } from '@playwright/test';

test('home page renders the login entry as the public landing page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: '智能晚辅托管系统登录' })).toBeVisible();
  await expect(page.getByRole('link', { name: /管理员登录/ })).toHaveAttribute('href', '/admin');
});
