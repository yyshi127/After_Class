import { expect, test } from '@playwright/test';

test('admin AI assistant refuses changing debt to zero and links to billing page', async ({ page }) => {
  await page.goto('/admin/ai-assistant');

  await expect(page.getByRole('heading', { name: 'AI 经营助手' })).toBeVisible();
  const refusalCard = page.getByRole('region', { name: '高风险拒绝卡片' });
  await expect(refusalCard).toContainText('把欠费改成 0');
  await expect(refusalCard).toContainText('AI 已拒绝执行高风险操作');
  await expect(refusalCard).toContainText('不能执行原因');
  await expect(refusalCard).toContainText('高风险动作禁止由 AI 执行，请转到传统页面并由有权限人员人工复核');
  await expect(refusalCard).toContainText('AI 不会修改收费、余额、欠费、老师课费或毛利数据。');
  await expect(refusalCard.getByRole('link', { name: '前往收费记录页人工复核' })).toHaveAttribute('href', '/admin/billing');
});
