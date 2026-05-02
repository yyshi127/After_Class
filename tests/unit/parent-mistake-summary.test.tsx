import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ParentMistakeSummaryCard } from '@/components/parent/parent-mistake-summary-card';
import { getParentVisibleMistakeSummaries } from '@/domain/parent/mistake-summary';

const guardian = {
  id: 'guardian-wang',
  role: 'GUARDIAN' as const,
  guardianStudentIds: ['student-wang'],
};

const mistakeItems = [
  {
    id: 'mistake-wang-1',
    campusId: 'campus-east',
    classId: 'class-evening-a',
    studentId: 'student-wang',
    studentName: '王小明',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    mistakeReason: '进位步骤遗漏',
    correctionStatus: 'PENDING_CORRECTION' as const,
    aiConfidence: 0.91,
    createdAt: '2026-05-02T12:00:00.000Z',
  },
  {
    id: 'mistake-li-1',
    campusId: 'campus-east',
    classId: 'class-evening-a',
    studentId: 'student-li',
    studentName: '李小红',
    subject: '英语',
    knowledgePoint: '一般过去时',
    mistakeReason: '动词时态混淆',
    correctionStatus: 'CORRECTED' as const,
    aiConfidence: 0.88,
    createdAt: '2026-05-02T12:00:00.000Z',
  },
];

describe('parent mistake summary', () => {
  it('returns only bound child mistake summaries without AI confidence', () => {
    const summaries = getParentVisibleMistakeSummaries({ guardian, mistakeItems });

    expect(summaries).toHaveLength(1);
    expect(summaries[0]).toEqual({
      id: 'mistake-wang-1',
      studentId: 'student-wang',
      studentName: '王小明',
      subject: '数学',
      knowledgePoint: '两位数乘法',
      mistakeReason: '进位步骤遗漏',
      correctionStatusLabel: '待订正',
      createdAt: '2026-05-02T12:00:00.000Z',
    });
    expect(JSON.stringify(summaries)).not.toContain('aiConfidence');
    expect(JSON.stringify(summaries)).not.toContain('李小红');
  });

  it('renders parent-facing mistake summary without internal AI confidence', () => {
    const summaries = getParentVisibleMistakeSummaries({ guardian, mistakeItems });

    render(<ParentMistakeSummaryCard summaries={summaries} />);

    expect(screen.getByRole('heading', { name: '孩子错题摘要' })).toBeInTheDocument();
    expect(screen.getByText('王小明')).toBeInTheDocument();
    expect(screen.getByText('两位数乘法')).toBeInTheDocument();
    expect(screen.getByText(/进位步骤遗漏/)).toBeInTheDocument();
    expect(screen.getByText('待订正')).toBeInTheDocument();
    expect(screen.queryByText('李小红')).not.toBeInTheDocument();
    expect(screen.queryByText(/置信度|aiConfidence|0\.91/)).not.toBeInTheDocument();
  });
});
