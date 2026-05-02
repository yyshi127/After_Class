import { expect, test } from '@playwright/test';

test('teacher can see AI mistake area confirmation controls before publishing homework', async ({ page }) => {
  await page.goto('/teacher/homework-correction');

  await expect(page.getByRole('heading', { name: 'AI 圈错确认' })).toBeVisible();
  await expect(page.getByText('未确认 AI 区域不会发布')).toBeVisible();
  await expect(page.getByRole('button', { name: '确认区域' })).toBeVisible();
  await expect(page.getByRole('button', { name: '修改区域' })).toBeVisible();
  await expect(page.getByRole('button', { name: '忽略区域' })).toBeVisible();
  await expect(page.getByText('确认区域将进入批改图和错题本候选')).toBeVisible();
});
