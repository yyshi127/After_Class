import { expect, test } from '@playwright/test';

test('AI confirmation and refusal flow covers guardian leave, teacher feedback draft, and admin high-risk refusal', async ({ page }) => {
  await page.goto('/parent');

  const leaveCard = page.getByRole('region', { name: '家长 AI 请假确认卡片' });
  await expect(leaveCard).toContainText('AI 请假确认');
  await expect(leaveCard).toContainText('明天晚辅导请假，孩子发烧');
  await expect(leaveCard).toContainText('确认前不会创建请假记录');
  await expect(leaveCard).toContainText('确认后状态：请假');
  await expect(leaveCard.getByRole('button', { name: '确认创建请假申请' })).toBeVisible();
  await expect(leaveCard.getByRole('button', { name: '取消' })).toBeVisible();

  await page.goto('/teacher');

  const feedbackCard = page.getByRole('region', { name: '老师 AI 反馈草稿确认卡片' });
  await expect(feedbackCard).toContainText('AI 反馈草稿');
  await expect(feedbackCard).toContainText('AI 草稿：作业完成较好');
  await expect(feedbackCard).toContainText('AI 草稿：课堂专注，能主动提问');
  await expect(feedbackCard).toContainText('发布状态：草稿');
  await expect(feedbackCard).toContainText('家长不可见，需老师编辑确认后发布');

  await page.goto('/admin/ai-assistant');

  const refusalCard = page.getByRole('region', { name: '高风险拒绝卡片' });
  await expect(refusalCard).toContainText('把欠费改成 0');
  await expect(refusalCard).toContainText('AI 已拒绝执行高风险操作');
  await expect(refusalCard.getByRole('link', { name: '前往收费记录页人工复核' })).toHaveAttribute('href', '/admin/billing');
});
