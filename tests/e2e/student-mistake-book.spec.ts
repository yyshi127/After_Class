import { expect, test } from '@playwright/test';

test('student mistake book page shows only own mistakes and AI explanation entry', async ({ page }) => {
  await page.goto('/student/mistake-book');

  await expect(page.getByRole('heading', { name: '学生端错题本' })).toBeVisible();
  await expect(page.getByText('两位数乘法')).toBeVisible();
  await expect(page.getByText('进位步骤遗漏')).toBeVisible();
  await expect(page.getByText('待订正')).toBeVisible();
  await expect(page.getByRole('button', { name: 'AI 讲解入口' })).toBeVisible();
  await expect(page.getByText('病句修改')).toHaveCount(0);
});
