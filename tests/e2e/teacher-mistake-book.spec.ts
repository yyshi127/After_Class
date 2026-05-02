import { expect, test } from '@playwright/test';

test('teacher mistake book page shows only assigned student mistakes with filters', async ({ page }) => {
  await page.goto('/teacher/mistake-book');

  await expect(page.getByRole('heading', { name: '老师端错题本' })).toBeVisible();
  await expect(page.getByLabel('学生筛选')).toBeVisible();
  await expect(page.getByLabel('学科筛选')).toBeVisible();
  await expect(page.getByLabel('知识点筛选')).toBeVisible();
  await expect(page.getByLabel('日期筛选')).toBeVisible();
  await expect(page.getByRole('heading', { name: '王小明' })).toBeVisible();
  const wangMistakeCard = page.locator('article').filter({ hasText: '王小明' });
  await expect(wangMistakeCard.getByText('两位数乘法')).toBeVisible();
  await expect(page.getByText('进位步骤遗漏')).toBeVisible();
  await expect(page.getByText('待订正')).toBeVisible();
  await expect(page.getByText('赵小西')).toHaveCount(0);
});
