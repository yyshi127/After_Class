import { expect, test } from '@playwright/test';

test('published homework mistake becomes a confirmed practice sheet Word download flow', async ({ page }) => {
  await page.goto('/teacher/homework-upload');
  await expect(page.getByRole('heading', { name: '上传作业' })).toBeVisible();
  await expect(page.getByText('上传后状态：待 AI 圈错')).toBeVisible();

  await page.getByRole('link', { name: '进入 AI 批改确认' }).click();
  await expect(page).toHaveURL(/\/teacher\/homework-correction$/);
  await expect(page.getByRole('heading', { name: 'AI 圈错确认' })).toBeVisible();
  await expect(page.getByText('确认状态：老师已确认')).toBeVisible();
  await expect(page.getByRole('button', { name: '发布给家长' })).toBeEnabled();
  await expect(page.getByText('发布后将自动收录错题：两位数乘法')).toBeVisible();

  await page.getByRole('link', { name: '查看自动收录错题' }).click();
  await expect(page).toHaveURL(/\/teacher\/mistake-book$/);
  const mistakeCard = page.getByRole('article').filter({ hasText: '两位数乘法' });
  await expect(mistakeCard.getByRole('heading', { name: '王小明' })).toBeVisible();
  await expect(mistakeCard.getByText('进位步骤遗漏')).toBeVisible();
  await expect(mistakeCard.getByRole('link', { name: '生成同类题练习单' })).toBeVisible();

  await mistakeCard.getByRole('link', { name: '生成同类题练习单' }).click();
  await expect(page).toHaveURL(/\/teacher\/practice-sheet$/);
  await expect(page.getByRole('heading', { name: '老师勾选同类题' })).toBeVisible();
  await expect(page.getByText('AI 已生成 3 道同类题草稿')).toBeVisible();
  await expect(page.getByLabel('编辑同类题：同类题1')).toHaveValue('同类题1：请用竖式计算 23 × 14，并写出进位过程。');
  await expect(page.getByRole('button', { name: '下载 Word 练习单' })).toBeEnabled();
  await expect(page.getByText('Word 文件：practice-draft-wang-20260502.docx')).toBeVisible();
  await expect(page.getByText('文件追溯：practice-draft-wang-20260502 / mistake-wang-1 / teacher-li')).toBeVisible();
});
