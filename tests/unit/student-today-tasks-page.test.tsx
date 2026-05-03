import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StudentTodayTasksPage } from '@/components/student/student-today-tasks-page';
import { getStudentTodayTaskSummary, type StudentTodayMistakeSource, type StudentTodayTaskSource } from '@/domain/student/today-tasks';

const student = {
  id: 'student-user-wang',
  role: 'STUDENT' as const,
};

const tasks: StudentTodayTaskSource[] = [
  {
    id: 'task-wang-math',
    campusId: 'campus-east',
    classId: 'class-east-g3',
    studentId: 'student-wang',
    studentUserId: 'student-user-wang',
    title: '完成数学计算练习第 3 页',
    subject: '数学',
    status: 'COMPLETED',
  },
  {
    id: 'task-wang-english',
    campusId: 'campus-east',
    classId: 'class-east-g3',
    studentId: 'student-wang',
    studentUserId: 'student-user-wang',
    title: '英语阅读打卡 15 分钟',
    subject: '英语',
    status: 'PENDING',
  },
  {
    id: 'task-li-chinese',
    campusId: 'campus-east',
    classId: 'class-east-g3',
    studentId: 'student-li',
    studentUserId: 'student-user-li',
    title: '其他同学的语文背诵',
    subject: '语文',
    status: 'PENDING',
  },
];

const mistakes: StudentTodayMistakeSource[] = [
  {
    id: 'mistake-wang-multiply',
    campusId: 'campus-east',
    classId: 'class-east-g3',
    studentId: 'student-wang',
    studentUserId: 'student-user-wang',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    correctionStatus: 'PENDING_CORRECTION',
  },
  {
    id: 'mistake-wang-corrected',
    campusId: 'campus-east',
    classId: 'class-east-g3',
    studentId: 'student-wang',
    studentUserId: 'student-user-wang',
    subject: '语文',
    knowledgePoint: '标点使用',
    correctionStatus: 'CORRECTED',
  },
  {
    id: 'mistake-li-sentence',
    campusId: 'campus-east',
    classId: 'class-east-g3',
    studentId: 'student-li',
    studentUserId: 'student-user-li',
    subject: '语文',
    knowledgePoint: '其他同学的病句修改',
    correctionStatus: 'PENDING_CORRECTION',
  },
];

describe('student today tasks page', () => {
  it('builds summary with only the current student tasks and pending corrections', () => {
    const summary = getStudentTodayTaskSummary({ actor: student, studentName: '王同学', tasks, mistakes });

    expect(summary.progressLabel).toBe('已完成 1/2');
    expect(summary.tasks.map((task) => task.title)).toEqual(['完成数学计算练习第 3 页', '英语阅读打卡 15 分钟']);
    expect(summary.pendingCorrections).toHaveLength(1);
    expect(summary.pendingCorrections[0]?.knowledgePoint).toBe('两位数乘法');
  });

  it('renders progress, encouragement, pending corrections and AI learning entry without other students data', () => {
    const summary = getStudentTodayTaskSummary({ actor: student, studentName: '王同学', tasks, mistakes });

    render(<StudentTodayTasksPage summary={summary} />);

    expect(screen.getByRole('heading', { name: '学生端今日任务' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '今日完成进度' })).toBeInTheDocument();
    expect(screen.getByText('已完成 1/2')).toBeInTheDocument();
    expect(screen.getByText('先完成待办，再订正错题，稳稳进步。')).toBeInTheDocument();
    expect(screen.getByText('完成数学计算练习第 3 页')).toBeInTheDocument();
    expect(screen.getByText('英语阅读打卡 15 分钟')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '待订正错题' })).toBeInTheDocument();
    expect(screen.getByText('两位数乘法')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'AI 学习入口' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '拍照提问' })).toBeInTheDocument();
    expect(screen.queryByText('其他同学的语文背诵')).not.toBeInTheDocument();
    expect(screen.queryByText('其他同学的病句修改')).not.toBeInTheDocument();
  });
});
