import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ParentHomeworkFeedbackDetail } from '@/components/parent/parent-homework-feedback-detail';
import { createParentHomeworkFeedbackDetail } from '@/domain/parent/homework-feedback-detail';

const guardian = {
  id: 'demo-guardian-wang',
  role: 'GUARDIAN' as const,
  guardianStudentIds: ['demo-student-profile-wang'],
};

const student = {
  id: 'demo-student-profile-wang',
  name: '王小明',
  campusId: 'demo-campus-east',
  classId: 'demo-class-east-g3',
};

const publishedFeedback = {
  reviewId: 'homework-review-wang-demo',
  studentId: 'demo-student-profile-wang',
  subject: '数学',
  originalImageFileId: 'file-homework-original-wang',
  correctedImageFileId: 'file-homework-corrected-wang',
  behaviorPerformance: '今天专注度较好，能主动提问。',
  homeworkCompletion: '数学作业已完成，订正 1 处。',
  knowledgeMastery: '两位数乘法仍需巩固。',
  publishedAt: '2026-05-02T12:00:00.000Z',
};

const attendanceRecords = [
  {
    id: 'attendance-arrival-wang',
    studentId: 'demo-student-profile-wang',
    status: '已到' as const,
    checkedAt: new Date('2026-05-02T10:30:00.000Z'),
    serviceType: '晚辅导' as const,
    photoFileId: 'photo://demo-arrival-wang',
  },
  {
    id: 'attendance-leave-wang',
    studentId: 'demo-student-profile-wang',
    status: '已离校' as const,
    checkedAt: new Date('2026-05-02T20:10:00.000Z'),
    serviceType: '晚辅导' as const,
    photoFileId: null,
  },
];

const mistakeSummaries = [
  {
    id: 'mistake-1',
    reviewId: 'homework-review-wang-demo',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    mistakeReason: '进位步骤遗漏',
    correctionStatus: '待订正' as const,
    source: 'TEACHER_CONFIRMED' as const,
    internalAiConfidence: 0.42,
    teacherInternalNote: '课堂后单独跟进',
  },
  {
    id: 'mistake-ignored-ai-draft',
    reviewId: 'homework-review-wang-demo',
    subject: '数学',
    knowledgePoint: '未确认草稿',
    mistakeReason: 'AI 未确认',
    correctionStatus: '待订正' as const,
    source: 'AI_DRAFT' as const,
    internalAiConfidence: 0.93,
    teacherInternalNote: '不要给家长看',
  },
];

describe('parent homework feedback detail', () => {
  it('builds a bound guardian detail with homework images, attendance timeline and confirmed mistake summary only', () => {
    const detail = createParentHomeworkFeedbackDetail({
      guardian,
      student,
      feedback: publishedFeedback,
      attendanceRecords,
      mistakeSummaries,
    });

    expect(detail).toMatchObject({
      reviewId: 'homework-review-wang-demo',
      studentName: '王小明',
      subject: '数学',
      originalImageFileId: 'file-homework-original-wang',
      correctedImageFileId: 'file-homework-corrected-wang',
      feedback: {
        behaviorPerformance: '今天专注度较好，能主动提问。',
        homeworkCompletion: '数学作业已完成，订正 1 处。',
        knowledgeMastery: '两位数乘法仍需巩固。',
      },
      attendanceTimeline: [
        expect.objectContaining({ status: '已到', photoFileId: 'photo://demo-arrival-wang' }),
        expect.objectContaining({ status: '已离校' }),
      ],
      mistakeSummaries: [
        {
          id: 'mistake-1',
          subject: '数学',
          knowledgePoint: '两位数乘法',
          mistakeReason: '进位步骤遗漏',
          correctionStatus: '待订正',
        },
      ],
    });

    expect(JSON.stringify(detail)).not.toMatch(/internalAiConfidence|teacherInternalNote|未确认草稿|AI 未确认/);
  });

  it('returns null when guardian is not bound to the student', () => {
    expect(
      createParentHomeworkFeedbackDetail({
        guardian: { id: 'other-guardian', role: 'GUARDIAN', guardianStudentIds: ['other-student'] },
        student,
        feedback: publishedFeedback,
        attendanceRecords,
        mistakeSummaries,
      }),
    ).toBeNull();
  });

  it('renders parent detail without teacher internal notes or AI confidence', () => {
    const detail = createParentHomeworkFeedbackDetail({
      guardian,
      student,
      feedback: publishedFeedback,
      attendanceRecords,
      mistakeSummaries,
    });

    render(<ParentHomeworkFeedbackDetail detail={detail} />);

    expect(screen.getByRole('heading', { name: '作业与考勤详情' })).toBeInTheDocument();
    expect(screen.getByText('王小明 · 数学')).toBeInTheDocument();
    expect(screen.getByText('作业原图：file-homework-original-wang')).toBeInTheDocument();
    expect(screen.getByText('批改图：file-homework-corrected-wang')).toBeInTheDocument();
    expect(screen.getByText('行为表现')).toBeInTheDocument();
    expect(screen.getByText('作业完成')).toBeInTheDocument();
    expect(screen.getByText('知识掌握')).toBeInTheDocument();
    expect(screen.getByText('到托/离校时间线')).toBeInTheDocument();
    expect(screen.getByText(/已到/)).toBeInTheDocument();
    expect(screen.getByText(/已离校/)).toBeInTheDocument();
    expect(screen.getByText('错题摘要')).toBeInTheDocument();
    expect(screen.getByText('两位数乘法')).toBeInTheDocument();
    expect(screen.getByText(/进位步骤遗漏/)).toBeInTheDocument();
    expect(screen.queryByText(/internalAiConfidence|老师内部|置信度|课堂后单独跟进|未确认草稿/)).not.toBeInTheDocument();
  });
});
