import { expect, test } from '@playwright/test';

test('teacher selects similar questions, edits prompt, and sees practice sheet draft gate', async ({ page }) => {
  await page.goto('/teacher/practice-sheet');

  await expect(page.getByRole('heading', { name: '老师勾选同类题' })).toBeVisible();
  await expect(page.getByText('王小明')).toBeVisible();
  await expect(page.getByLabel('勾选同类题：同类题1')).toBeChecked();
  await expect(page.getByLabel('编辑同类题：同类题1')).toHaveValue('同类题1：请用竖式计算 23 × 14，并写出进位过程。');
  await expect(page.getByText('练习单草稿已保存')).toBeVisible();
  await expect(page.getByRole('button', { name: '生成 Word 练习单' })).toBeEnabled();
  await expect(page.getByText('未勾选同类题，不能生成 Word 练习单')).toBeVisible();
  await expect(page.getByRole('button', { name: '未勾选不能生成 Word' })).toBeDisabled();
});
