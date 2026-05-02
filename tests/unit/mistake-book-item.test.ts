import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { createMistakeBookItemsFromConfirmedAreas } from '@/domain/mistake-book/mistake-book-item';

describe('mistake book item model', () => {
  it('defines MistakeBookItem with homework source, subject, knowledge point, image region and correction status', () => {
    const schema = readFileSync('prisma/schema.prisma', 'utf8');

    expect(schema).toContain('enum MistakeCorrectionStatus');
    expect(schema).toContain('model MistakeBookItem');
    expect(schema).toMatch(/studentId\s+String/);
    expect(schema).toMatch(/homeworkReviewId\s+String/);
    expect(schema).toMatch(/subject\s+String/);
    expect(schema).toMatch(/knowledgePoint\s+String/);
    expect(schema).toMatch(/mistakeReason\s+String/);
    expect(schema).toMatch(/imageRegion\s+Json/);
    expect(schema).toMatch(/correctionStatus\s+MistakeCorrectionStatus/);
  });

  it('creates mistake book records only from teacher-confirmed or modified mistake areas', () => {
    const items = createMistakeBookItemsFromConfirmedAreas({
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-g3',
      studentId: 'demo-student-profile-wang',
      homeworkReviewId: 'homework-review-wang-demo',
      createdAt: new Date('2026-05-02T12:00:00.000Z'),
      areas: [
        {
          id: 'area-confirmed',
          sourceAiAreaId: 'ai-area-confirmed',
          subject: '数学',
          knowledgePoint: '两位数乘法',
          mistakeReason: '进位步骤遗漏',
          originalBox: { x: 120, y: 320, width: 360, height: 480 },
          confidence: 0.86,
          confirmationStatus: 'CONFIRMED',
          confirmedByTeacherUserId: 'demo-teacher-li',
          confirmedAt: '2026-05-02T11:00:00.000Z',
        },
        {
          id: 'area-modified',
          sourceAiAreaId: 'ai-area-modified',
          subject: '数学',
          knowledgePoint: '竖式计算',
          mistakeReason: '老师修改后的错因',
          originalBox: { x: 10, y: 20, width: 30, height: 40 },
          confidence: 0.62,
          confirmationStatus: 'MODIFIED',
          confirmedByTeacherUserId: 'demo-teacher-li',
          confirmedAt: '2026-05-02T11:05:00.000Z',
        },
        {
          sourceAiAreaId: 'ai-area-ignored',
          confirmationStatus: 'IGNORED',
          ignoreReason: '误识别',
          confirmedByTeacherUserId: 'demo-teacher-li',
          confirmedAt: '2026-05-02T11:10:00.000Z',
        },
      ],
    });

    expect(items).toHaveLength(2);
    expect(items).toEqual([
      expect.objectContaining({
        id: 'mistake-homework-review-wang-demo-area-confirmed',
        campusId: 'demo-campus-east',
        classId: 'demo-class-east-g3',
        studentId: 'demo-student-profile-wang',
        homeworkReviewId: 'homework-review-wang-demo',
        sourceAreaId: 'area-confirmed',
        subject: '数学',
        knowledgePoint: '两位数乘法',
        mistakeReason: '进位步骤遗漏',
        imageRegion: { x: 120, y: 320, width: 360, height: 480 },
        correctionStatus: 'PENDING_CORRECTION',
        aiConfidence: 0.86,
      }),
      expect.objectContaining({
        sourceAreaId: 'area-modified',
        knowledgePoint: '竖式计算',
        mistakeReason: '老师修改后的错因',
        correctionStatus: 'PENDING_CORRECTION',
      }),
    ]);
  });
});
