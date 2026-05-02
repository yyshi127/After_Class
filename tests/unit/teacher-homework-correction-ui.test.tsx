import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import TeacherHomeworkCorrectionPage from '@/app/teacher/homework-correction/page';

describe('M8 teacher homework correction UI', () => {
  it('organizes image correction, mistake review, feedback publishing, and practice sheet actions into touch-friendly regions', () => {
    render(<TeacherHomeworkCorrectionPage />);

    const workspace = screen.getByRole('main', { name: '老师作业批改工作台' });
    expect(workspace).toBeInTheDocument();

    const imageRegion = within(workspace).getByRole('region', { name: '作业图片与圈错区' });
    expect(within(imageRegion).getByAltText('王小明的数学作业原图')).toBeInTheDocument();
    expect(within(imageRegion).getByText('区域坐标：x120 / y320 / w360 / h480')).toBeInTheDocument();

    expect(within(workspace).getByRole('region', { name: 'AI 圈错确认区' })).toBeInTheDocument();
    expect(within(workspace).getByRole('region', { name: '三类点评编辑区' })).toBeInTheDocument();

    const actionRegion = within(workspace).getByRole('region', { name: '发布与练习单操作区' });
    expect(within(actionRegion).getByText('发布后自动收录错题，并可进入错题本生成 Word 练习单')).toBeInTheDocument();
    expect(within(actionRegion).getByRole('link', { name: '进入练习单生成' })).toHaveAttribute(
      'href',
      '/teacher/practice-sheet',
    );

    const touchTargets = within(workspace).getAllByRole('button').concat(within(workspace).getAllByRole('link'));
    expect(touchTargets.length).toBeGreaterThan(0);
    for (const target of touchTargets) {
      expect(target.className).toEqual(expect.stringContaining('min-h-11'));
    }
  });
});
