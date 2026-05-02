import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminHomeworkFeedbackProgress } from '@/components/admin/admin-homework-feedback-progress';
import { getAdminHomeworkFeedbackProgress } from '@/domain/admin/homework-feedback-progress';

const campusAdmin = {
  id: 'demo-campus-admin-east',
  role: 'CAMPUS_ADMIN' as const,
  campusIds: ['demo-campus-east'],
};

const rows = [
  {
    id: 'review-uploaded-east',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: 'UPLOADED' as const,
    publishStatus: 'DRAFT' as const,
  },
  {
    id: 'review-reviewed-east',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: 'TEACHER_REVIEWED' as const,
    publishStatus: 'DRAFT' as const,
  },
  {
    id: 'review-published-east',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: 'TEACHER_REVIEWED' as const,
    publishStatus: 'PUBLISHED' as const,
  },
  {
    id: 'review-hidden-west',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    classId: 'demo-class-west-g3',
    className: '西城三年级晚辅 A 班',
    serviceType: '晚辅导' as const,
    status: 'TEACHER_REVIEWED' as const,
    publishStatus: 'PUBLISHED' as const,
  },
];

describe('admin homework feedback progress', () => {
  it('groups homework progress by campus and class within admin campus scope', () => {
    const progress = getAdminHomeworkFeedbackProgress(campusAdmin, rows);

    expect(progress).toEqual([
      {
        campusId: 'demo-campus-east',
        campusName: '东城托管中心',
        classId: 'demo-class-east-g3',
        className: '东城三年级晚辅 A 班',
        serviceType: '晚辅导',
        pendingCorrectionCount: 1,
        pendingPublishCount: 1,
        publishedCount: 1,
        totalCount: 3,
        publishedRateLabel: '33.33%',
      },
    ]);
  });

  it('does not expose homework progress to teacher or parent roles', () => {
    expect(getAdminHomeworkFeedbackProgress({ id: 'teacher', role: 'TEACHER' }, rows)).toEqual([]);
    expect(getAdminHomeworkFeedbackProgress({ id: 'guardian', role: 'GUARDIAN' }, rows)).toEqual([]);
  });

  it('renders pending correction, pending publish and published counts without cross-campus rows', () => {
    render(<AdminHomeworkFeedbackProgress actor={campusAdmin} rows={rows} />);

    expect(screen.getByRole('heading', { name: '作业反馈进度' })).toBeInTheDocument();
    const eastRow = screen.getByRole('row', { name: /东城托管中心/ });
    expect(within(eastRow).getByText('待批改 1')).toBeInTheDocument();
    expect(within(eastRow).getByText('待发布 1')).toBeInTheDocument();
    expect(within(eastRow).getByText('已发布 1')).toBeInTheDocument();
    expect(within(eastRow).getByText('33.33%')).toBeInTheDocument();
    expect(screen.queryByText('西城托管中心')).not.toBeInTheDocument();
  });
});
