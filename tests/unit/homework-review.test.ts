import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  canGuardianViewHomeworkReview,
  createHomeworkReviewDraft,
} from '@/domain/homework/homework-review';

const publishedReview = {
  id: 'homework-review-published',
  campusId: 'demo-campus-east',
  classId: 'demo-class-east-grade3-a',
  studentId: 'demo-student-profile-wang',
  publishStatus: 'PUBLISHED' as const,
};

const draftReview = {
  ...publishedReview,
  id: 'homework-review-draft',
  publishStatus: 'DRAFT' as const,
};

const guardian = {
  id: 'demo-guardian-wang-mother',
  role: 'GUARDIAN' as const,
  guardianStudentIds: ['demo-student-profile-wang'],
};

const otherGuardian = {
  id: 'demo-guardian-other',
  role: 'GUARDIAN' as const,
  guardianStudentIds: ['demo-student-profile-li'],
};

describe('homework review model and visibility', () => {
  it('defines HomeworkReview model with original/corrected images, status, AI and teacher areas', () => {
    const schema = readFileSync('prisma/schema.prisma', 'utf8');

    expect(schema).toContain('enum HomeworkReviewStatus');
    expect(schema).toContain('enum HomeworkPublishStatus');
    expect(schema).toContain('model HomeworkReview');
    expect(schema).toContain('originalImageFileId  String');
    expect(schema).toContain('correctedImageFileId String?');
    expect(schema).toContain('subject              String');
    expect(schema).toContain('aiSuggestedAreas     Json?');
    expect(schema).toContain('teacherConfirmedAreas Json?');
    expect(schema).toContain('publishStatus        HomeworkPublishStatus');
  });

  it('creates an unpublished homework review draft from a private original image', () => {
    const draft = createHomeworkReviewDraft({
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-grade3-a',
      studentId: 'demo-student-profile-wang',
      teacherUserId: 'demo-teacher-zhao',
      originalImageFileId: 'file-homework-original-wang',
      subject: '数学',
    });

    expect(draft).toMatchObject({
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-grade3-a',
      studentId: 'demo-student-profile-wang',
      teacherUserId: 'demo-teacher-zhao',
      originalImageFileId: 'file-homework-original-wang',
      correctedImageFileId: null,
      subject: '数学',
      status: 'UPLOADED',
      aiSuggestedAreas: null,
      teacherConfirmedAreas: null,
      publishStatus: 'DRAFT',
      publishedAt: null,
    });
  });

  it('keeps unpublished homework reviews invisible to guardians', () => {
    expect(canGuardianViewHomeworkReview({ guardian, review: draftReview })).toBe(false);
    expect(canGuardianViewHomeworkReview({ guardian, review: publishedReview })).toBe(true);
    expect(canGuardianViewHomeworkReview({ guardian: otherGuardian, review: publishedReview })).toBe(false);
  });
});
