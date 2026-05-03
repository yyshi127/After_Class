import { expect, test } from '@playwright/test';

test('student today task page shows own progress, pending corrections and AI learning entry on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/student');

  await expect(page.getByRole('heading', { name: '学生端今日任务' })).toBeVisible();
  await expect(page.getByRole('region', { name: '今日完成进度' })).toBeVisible();
  await expect(page.getByText('已完成 1/2')).toBeVisible();
  await expect(page.getByText('先完成待办，再订正错题，稳稳进步。')).toBeVisible();
  await expect(page.getByRole('region', { name: '今日待办任务' })).toBeVisible();
  await expect(page.getByText('完成数学计算练习第 3 页')).toBeVisible();
  await expect(page.getByText('英语阅读打卡 15 分钟')).toBeVisible();
  await expect(page.getByRole('region', { name: '待订正错题' })).toBeVisible();
  await expect(page.getByText('两位数乘法')).toBeVisible();
  await expect(page.getByRole('region', { name: 'AI 学习入口' })).toBeVisible();
  await expect(page.getByRole('button', { name: '拍照提问' })).toBeVisible();
  await expect(page.getByText('其他同学的语文背诵')).toHaveCount(0);
  await expect(page.getByText('其他同学的病句修改')).toHaveCount(0);

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(horizontalOverflow).toBe(false);
});
