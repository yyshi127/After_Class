import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TeacherPracticeSheetDraftPage } from '@/components/teacher/teacher-practice-sheet-draft-page';

const draft = {
  id: 'practice-draft-wang-20260502',
  studentId: 'student-wang',
  studentName: '王小明',
  classId: 'class-evening-a',
  className: '晚辅 A 班',
  subject: '数学',
  sourceMistakeBookItemIds: ['mistake-wang-1'],
  createdAt: '2026-05-02T15:00:00.000Z',
  questions: [
    {
      id: 'practice-question-1',
      sourceQuestionId: 'similar-mistake-wang-1-1',
      sourceMistakeBookItemId: 'mistake-wang-1',
      knowledgePoint: '两位数乘法',
      prompt: '同类题1：请用竖式计算 23 × 14，并写出进位过程。',
      teacherConfirmed: true,
    },
  ],
  canGenerateWord: true,
  blockedReason: null,
};

const emptyDraft = {
  ...draft,
  id: 'practice-draft-empty',
  questions: [],
  canGenerateWord: false,
  blockedReason: '未勾选同类题，不能生成 Word 练习单',
};

describe('TeacherPracticeSheetDraftPage', () => {
  it('renders selectable similar questions, edited prompt, and saved draft summary', () => {
    render(<TeacherPracticeSheetDraftPage draft={draft} />);

    expect(screen.getByRole('heading', { name: '老师勾选同类题' })).toBeInTheDocument();
    expect(screen.getByText('王小明')).toBeInTheDocument();
    expect(screen.getByText(/两位数乘法/)).toBeInTheDocument();
    expect(screen.getByLabelText('勾选同类题：同类题1')).toBeChecked();
    expect(screen.getByDisplayValue('同类题1：请用竖式计算 23 × 14，并写出进位过程。')).toBeInTheDocument();
    expect(screen.getByText('练习单草稿已保存')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '生成 Word 练习单' })).toBeEnabled();
  });

  it('disables Word generation when no question is selected', () => {
    render(<TeacherPracticeSheetDraftPage draft={emptyDraft} />);

    expect(screen.getByText('未勾选同类题，不能生成 Word 练习单')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '生成 Word 练习单' })).toBeDisabled();
  });
});
