import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StudentMistakeBookPage } from '@/components/student/student-mistake-book-page';
import { getStudentMistakeBookItems } from '@/domain/student/mistake-book';

const mistakeItems = [
  {
    id: 'mistake-wang-1',
    campusId: 'campus-east',
    classId: 'class-east-g3',
    studentId: 'student-wang',
    studentUserId: 'student-user-wang',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    mistakeReason: '进位步骤遗漏',
    questionText: '23 × 14 竖式计算',
    correctionStatus: 'PENDING_CORRECTION' as const,
    createdAt: '2026-05-02T12:30:00.000Z',
  },
  {
    id: 'mistake-li-1',
    campusId: 'campus-east',
    classId: 'class-east-g3',
    studentId: 'student-li',
    studentUserId: 'student-user-li',
    subject: '语文',
    knowledgePoint: '病句修改',
    mistakeReason: '主谓搭配不当',
    questionText: '修改病句：同学们认真地讨论并听取了建议。',
    correctionStatus: 'CORRECTED' as const,
    createdAt: '2026-05-02T13:00:00.000Z',
  },
];

const student = {
  id: 'student-user-wang',
  role: 'STUDENT' as const,
};

describe('student mistake book page', () => {
  it('only returns the current student own mistakes', () => {
    const items = getStudentMistakeBookItems({ actor: student, items: mistakeItems });

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(
      expect.objectContaining({
        id: 'mistake-wang-1',
        knowledgePoint: '两位数乘法',
        correctionStatusLabel: '待订正',
        aiExplanationEntryLabel: 'AI 讲解入口',
        similarPracticeEntryLabel: '同类题练习',
        photoQuestionEntryLabel: '拍照提问',
      }),
    );
  });

  it('renders own mistake status and AI explanation entry without other student mistakes', () => {
    render(<StudentMistakeBookPage actor={student} items={mistakeItems} />);

    expect(screen.getByRole('heading', { name: '学生端错题本' })).toBeInTheDocument();
    expect(screen.getByText('两位数乘法')).toBeInTheDocument();
    expect(screen.getByText('进位步骤遗漏')).toBeInTheDocument();
    expect(screen.getByText('待订正')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AI 讲解入口' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '同类题练习' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '拍照提问' })).toBeInTheDocument();
    expect(screen.queryByText('病句修改')).not.toBeInTheDocument();
  });
});
