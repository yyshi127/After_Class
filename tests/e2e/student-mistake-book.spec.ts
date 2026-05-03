import { expect, test } from '@playwright/test';

test('student mistake book page shows only own mistakes and learning entries on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/student/mistake-book');

  await expect(page.getByRole('heading', { name: '学生端错题本' })).toBeVisible();
  await expect(page.getByText('两位数乘法')).toBeVisible();
  await expect(page.getByText('进位步骤遗漏')).toBeVisible();
  await expect(page.getByText('待订正')).toBeVisible();
  await expect(page.getByRole('button', { name: 'AI 讲解入口' })).toBeVisible();
  await expect(page.getByRole('button', { name: '同类题练习' })).toBeVisible();
  await expect(page.getByRole('button', { name: '拍照提问' })).toBeVisible();
  await expect(page.getByText('病句修改')).toHaveCount(0);

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(horizontalOverflow).toBe(false);
});
