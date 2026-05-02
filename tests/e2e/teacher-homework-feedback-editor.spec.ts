import { expect, test } from '@playwright/test';

test('teacher can edit three-part homework feedback draft before publishing', async ({ page }) => {
  await page.goto('/teacher/homework-correction');

  await expect(page.getByRole('heading', { name: '三类今日点评' })).toBeVisible();
  await expect(page.getByText('AI 草稿可编辑，发布前必须老师确认')).toBeVisible();
  await expect(page.getByLabel('行为表现')).toHaveValue('AI 草稿：今天专注度较好，能主动提问。');
  await expect(page.getByLabel('作业完成')).toHaveValue('AI 草稿：数学作业已完成，订正 1 处。');
  await expect(page.getByLabel('知识掌握')).toHaveValue('AI 草稿：两位数乘法仍需巩固。');
  await expect(page.getByRole('button', { name: '发布给家长' })).toBeEnabled();
});
