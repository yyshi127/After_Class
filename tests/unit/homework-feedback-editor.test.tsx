import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TeacherHomeworkFeedbackEditor } from '@/components/teacher/teacher-homework-feedback-editor';
import { canPublishFeedbackDraft, createEditableFeedbackDraft } from '@/domain/feedback/feedback';

describe('teacher homework feedback editor', () => {
  it('creates editable three-part AI feedback draft without publishing it', () => {
    const draft = createEditableFeedbackDraft({
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-grade3-a',
      studentId: 'demo-student-profile-wang',
      teacherUserId: 'demo-teacher-zhao',
      homeworkReviewId: 'homework-review-wang-demo',
      behaviorPerformance: 'AI 草稿：今天专注度较好。',
      homeworkCompletion: 'AI 草稿：数学作业已完成，订正 1 处。',
      knowledgeMastery: 'AI 草稿：两位数乘法仍需巩固。',
      draftSource: 'AI',
    });

    expect(draft).toMatchObject({
      behaviorPerformance: 'AI 草稿：今天专注度较好。',
      homeworkCompletion: 'AI 草稿：数学作业已完成，订正 1 处。',
      knowledgeMastery: 'AI 草稿：两位数乘法仍需巩固。',
      draftSource: 'AI',
      publishStatus: 'DRAFT',
      publishedAt: null,
    });
  });

  it('blocks publish when homework completion feedback is empty', () => {
    const draft = createEditableFeedbackDraft({
      campusId: 'demo-campus-east',
      studentId: 'demo-student-profile-wang',
      teacherUserId: 'demo-teacher-zhao',
      behaviorPerformance: '课堂纪律稳定',
      homeworkCompletion: '   ',
      knowledgeMastery: '计算方法基本掌握',
    });

    expect(canPublishFeedbackDraft(draft)).toEqual({
      ok: false,
      errors: ['作业完成点评不能为空'],
    });
  });

  it('renders editable fields for behavior, homework completion, and knowledge mastery AI draft', () => {
    render(
      <TeacherHomeworkFeedbackEditor
        draft={{
          campusId: 'demo-campus-east',
          classId: 'demo-class-east-grade3-a',
          studentId: 'demo-student-profile-wang',
          teacherUserId: 'demo-teacher-zhao',
          homeworkReviewId: 'homework-review-wang-demo',
          behaviorPerformance: 'AI 草稿：今天能按时完成托管任务。',
          homeworkCompletion: '',
          knowledgeMastery: 'AI 草稿：应用题读题需要加强。',
          draftSource: 'AI',
          publishStatus: 'DRAFT',
          publishedAt: null,
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: '三类今日点评' })).toBeInTheDocument();
    expect(screen.getByLabelText('行为表现')).toHaveValue('AI 草稿：今天能按时完成托管任务。');
    expect(screen.getByLabelText('作业完成')).toHaveValue('');
    expect(screen.getByLabelText('知识掌握')).toHaveValue('AI 草稿：应用题读题需要加强。');
    expect(screen.getByText('AI 草稿可编辑，发布前必须老师确认')).toBeInTheDocument();
    expect(screen.getByText('作业完成点评不能为空')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '发布给家长' })).toBeDisabled();
  });
});
