import { expect, test } from '@playwright/test';

const expectedRoleLinks = [
  { name: '管理员登录', href: '/admin' },
  { name: '老师登录', href: '/teacher' },
  { name: '家长登录', href: '/parent' },
  { name: '学生登录', href: '/student' },
];

test('root page presents the login entry instead of the old development splash', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: '智能晚辅托管系统登录' })).toBeVisible();
  await expect(page.getByText('智能晚辅托管系统开发环境已就绪')).not.toBeVisible();

  for (const link of expectedRoleLinks) {
    await expect(page.getByRole('link', { name: new RegExp(link.name) })).toHaveAttribute('href', link.href);
  }
});

test('/login opens the same role login entry on mobile without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');

  await expect(page.getByRole('heading', { name: '智能晚辅托管系统登录' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: '角色登录入口' })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
