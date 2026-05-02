import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TeacherMistakeBookPage } from '@/components/teacher/teacher-mistake-book-page';
import { getTeacherMistakeBookItems } from '@/domain/teacher/mistake-book';

const mistakeItems = [
  {
    id: 'mistake-east-1',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g3',
    className: '三年级晚辅 A 班',
    studentId: 'student-east-1',
    studentName: '王小明',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    mistakeReason: '进位步骤遗漏',
    questionText: '23 × 14 竖式计算',
    correctionStatus: 'PENDING_CORRECTION' as const,
    createdAt: '2026-05-02T12:30:00.000Z',
  },
  {
    id: 'mistake-east-2',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g4',
    className: '四年级晚辅 B 班',
    studentId: 'student-east-2',
    studentName: '李小红',
    subject: '语文',
    knowledgePoint: '病句修改',
    mistakeReason: '主谓搭配不当',
    questionText: '修改病句：同学们认真地讨论并听取了建议。',
    correctionStatus: 'CORRECTED' as const,
    createdAt: '2026-05-02T13:00:00.000Z',
  },
  {
    id: 'mistake-west-1',
    campusId: 'campus-west',
    campusName: '西城托管中心',
    classId: 'class-west-g3',
    className: '西城三年级晚辅 A 班',
    studentId: 'student-west-1',
    studentName: '赵小西',
    subject: '数学',
    knowledgePoint: '分数比较',
    mistakeReason: '通分错误',
    questionText: '比较 2/3 和 3/5 的大小',
    correctionStatus: 'PENDING_CORRECTION' as const,
    createdAt: '2026-05-02T13:30:00.000Z',
  },
];

const teacher = {
  id: 'teacher-li',
  role: 'TEACHER' as const,
  teacherAssignments: [{ campusId: 'campus-east', classId: 'class-east-g3' }],
};

describe('teacher mistake book page', () => {
  it('only returns mistake items for students assigned to the teacher', () => {
    const items = getTeacherMistakeBookItems({ actor: teacher, items: mistakeItems });

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(
      expect.objectContaining({
        id: 'mistake-east-1',
        studentName: '王小明',
        className: '三年级晚辅 A 班',
        knowledgePoint: '两位数乘法',
        correctionStatusLabel: '待订正',
      }),
    );
  });

  it('supports student, subject, knowledge point and date filters inside teacher scope', () => {
    const campusScopedTeacher = {
      id: 'teacher-east',
      role: 'TEACHER' as const,
      teacherAssignments: [{ campusId: 'campus-east' }],
    };

    const items = getTeacherMistakeBookItems({
      actor: campusScopedTeacher,
      items: mistakeItems,
      filters: {
        studentId: 'student-east-2',
        subject: '语文',
        knowledgePoint: '病句修改',
        createdDate: '2026-05-02',
      },
    });

    expect(items).toHaveLength(1);
    expect(items[0].studentName).toBe('李小红');
    expect(items[0].correctionStatusLabel).toBe('已订正');
  });

  it('renders filters and assigned student mistake cards without cross-campus items', () => {
    render(<TeacherMistakeBookPage actor={teacher} items={mistakeItems} />);

    expect(screen.getByRole('heading', { name: '老师端错题本' })).toBeInTheDocument();
    expect(screen.getByLabelText('学生筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('学科筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('知识点筛选')).toBeInTheDocument();
    expect(screen.getByLabelText('日期筛选')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '王小明' })).toBeInTheDocument();
    expect(screen.getAllByText('两位数乘法').length).toBeGreaterThan(0);
    expect(screen.getByText('进位步骤遗漏')).toBeInTheDocument();
    expect(screen.getByText('待订正')).toBeInTheDocument();
    expect(screen.queryByText('赵小西')).not.toBeInTheDocument();
  });
});
