import { expect, test } from '@playwright/test';

const roleShells = [
  { path: '/admin', heading: '管理端工作台' },
  { path: '/teacher', heading: '老师端工作台' },
  { path: '/parent', heading: '家长端首页' },
  { path: '/student', heading: '学生端今日任务' },
] as const;

for (const roleShell of roleShells) {
  test(`${roleShell.path} renders its role shell`, async ({ page }) => {
    await page.goto(roleShell.path);
    await expect(page.getByRole('heading', { name: roleShell.heading })).toBeVisible();
  });
}
