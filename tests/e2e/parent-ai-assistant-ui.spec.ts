import { expect, test } from '@playwright/test';

test('parent AI assistant shows text voice entry, query results, and clear confirm/cancel paths', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/parent');

  const assistant = page.getByRole('region', { name: '家长 AI 助手' });
  await expect(assistant).toContainText('家长 AI 助手');
  await expect(assistant.getByLabel('输入文字指令')).toHaveValue('明天晚辅导请假，孩子发烧');
  await expect(assistant.getByRole('button', { name: '生成确认卡片' })).toBeVisible();
  await expect(assistant.getByRole('button', { name: '按住说话' })).toBeVisible();

  const queryResult = assistant.getByRole('region', { name: '家长 AI 查询结果' });
  await expect(queryResult).toContainText('到托状态');
  await expect(queryResult).toContainText('今日作业反馈已发布');
  await expect(queryResult).toContainText('有效至 2026-05-31');

  const leaveCard = assistant.getByRole('region', { name: '家长 AI 请假确认卡片' });
  await expect(leaveCard).toContainText('确认前不会创建请假记录');
  await expect(leaveCard.getByRole('button', { name: '确认创建请假申请' })).toBeVisible();
  await expect(leaveCard.getByRole('button', { name: '取消本次 AI 建议' })).toBeVisible();
});
