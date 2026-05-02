import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TeacherMistakeAreaReviewPanel } from '@/components/teacher/teacher-mistake-area-review-panel';
import {
  applyTeacherMistakeAreaDecisions,
  getPublishableMistakeAreas,
} from '@/domain/homework/mistake-area-confirmation';

const aiAreas = [
  {
    id: 'ai-area-1',
    originalBox: { x: 120, y: 320, width: 360, height: 480 },
    subject: '数学',
    mistakeReason: '竖式进位漏写',
    confidence: 0.86,
    confidenceLevel: 'MEDIUM' as const,
    requiresManualConfirmation: true,
    confirmationHint: 'AI 建议区域，发布前必须老师确认',
  },
  {
    id: 'ai-area-2',
    originalBox: { x: 80, y: 180, width: 200, height: 160 },
    subject: '数学',
    mistakeReason: '疑似审题偏差',
    confidence: 0.42,
    confidenceLevel: 'LOW' as const,
    requiresManualConfirmation: true,
    confirmationHint: '低置信度，请老师手动确认或调整',
  },
  {
    id: 'ai-area-3',
    originalBox: { x: 500, y: 900, width: 260, height: 180 },
    subject: '数学',
    mistakeReason: '单位漏写',
    confidence: 0.91,
    confidenceLevel: 'HIGH' as const,
    requiresManualConfirmation: true,
    confirmationHint: 'AI 建议区域，发布前必须老师确认',
  },
];

describe('teacher mistake area confirmation', () => {
  it('only publishes teacher confirmed or modified AI mistake areas', () => {
    const result = applyTeacherMistakeAreaDecisions({
      reviewId: 'homework-review-wang-1',
      aiSuggestedAreas: aiAreas,
      decisions: [
        { areaId: 'ai-area-1', action: 'CONFIRM' },
        {
          areaId: 'ai-area-2',
          action: 'MODIFY',
          originalBox: { x: 90, y: 200, width: 180, height: 150 },
          mistakeReason: '审题偏差，关键词漏看',
        },
        { areaId: 'ai-area-3', action: 'IGNORE', ignoreReason: '老师判断不是错题' },
      ],
      confirmedByTeacherUserId: 'demo-teacher-zhao',
      confirmedAt: new Date('2026-05-02T10:00:00.000Z'),
    });

    expect(result.status).toBe('TEACHER_REVIEWED');
    expect(result.teacherConfirmedAreas).toEqual([
      expect.objectContaining({
        id: 'ai-area-1',
        sourceAiAreaId: 'ai-area-1',
        confirmationStatus: 'CONFIRMED',
        mistakeReason: '竖式进位漏写',
      }),
      expect.objectContaining({
        id: 'ai-area-2',
        sourceAiAreaId: 'ai-area-2',
        confirmationStatus: 'MODIFIED',
        originalBox: { x: 90, y: 200, width: 180, height: 150 },
        mistakeReason: '审题偏差，关键词漏看',
      }),
    ]);
    expect(result.ignoredAreas).toEqual([
      expect.objectContaining({
        sourceAiAreaId: 'ai-area-3',
        confirmationStatus: 'IGNORED',
        ignoreReason: '老师判断不是错题',
      }),
    ]);
  });

  it('keeps unconfirmed AI mistake areas out of corrected image and mistake book candidates', () => {
    const result = applyTeacherMistakeAreaDecisions({
      reviewId: 'homework-review-wang-2',
      aiSuggestedAreas: aiAreas,
      decisions: [{ areaId: 'ai-area-1', action: 'CONFIRM' }],
      confirmedByTeacherUserId: 'demo-teacher-zhao',
      confirmedAt: new Date('2026-05-02T10:00:00.000Z'),
    });

    expect(getPublishableMistakeAreas(result)).toHaveLength(1);
    expect(getPublishableMistakeAreas(result).map((area) => area.sourceAiAreaId)).toEqual(['ai-area-1']);
    expect(result.unconfirmedAreaIds).toEqual(['ai-area-2', 'ai-area-3']);
  });

  it('renders review controls for confirming, modifying and ignoring AI areas', () => {
    render(
      <TeacherMistakeAreaReviewPanel
        reviewId="homework-review-wang-1"
        aiSuggestedAreas={aiAreas}
      />,
    );

    expect(screen.getByRole('heading', { name: 'AI 圈错确认' })).toBeInTheDocument();
    expect(screen.getByText('未确认 AI 区域不会发布')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '确认区域' })).toHaveLength(3);
    expect(screen.getAllByRole('button', { name: '修改区域' })).toHaveLength(3);
    expect(screen.getAllByRole('button', { name: '忽略区域' })).toHaveLength(3);
    expect(screen.getByText('确认区域将进入批改图和错题本候选')).toBeInTheDocument();
  });
});
