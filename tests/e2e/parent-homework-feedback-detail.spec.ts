import { expect, test } from '@playwright/test';

test('parent can open homework and attendance detail without internal AI or teacher notes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/parent/homework-feedback');

  await expect(page.getByRole('heading', { name: '作业与考勤详情' })).toBeVisible();
  await expect(page.getByText('王小明 · 数学')).toBeVisible();
  const imageEvidence = page.getByRole('region', { name: '作业图片凭证' });
  await expect(imageEvidence).toContainText('作业原图：file-homework-original-wang');
  await expect(imageEvidence).toContainText('批改图：file-homework-corrected-wang');
  const learningFeedback = page.getByRole('region', { name: '三类学习反馈' });
  await expect(learningFeedback).toContainText('行为表现');
  await expect(learningFeedback).toContainText('作业完成');
  await expect(learningFeedback).toContainText('知识掌握');
  await expect(page.getByRole('region', { name: '到托离校时间线' })).toBeVisible();
  await expect(page.getByText(/已到/)).toBeVisible();
  await expect(page.getByText(/已离校/)).toBeVisible();
  await expect(page.getByRole('region', { name: '家长错题摘要' })).toContainText('错题摘要');
  await expect(page.getByText('两位数乘法', { exact: true })).toBeVisible();

  await expect(page.getByText(/AI 内部|置信度|老师内部备注|课堂后单独跟进|未确认草稿/)).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);
});
