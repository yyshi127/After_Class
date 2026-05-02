import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import { createEditableFeedbackDraft, type FeedbackDraft } from '@/domain/feedback/feedback';

export type TeacherFeedbackDraftStudent = {
  id: string;
  name: string;
  campusId: string;
  classId?: string | null;
};

export type TeacherFeedbackDraftForAiInput = {
  teacher: PermissionActor;
  student: TeacherFeedbackDraftStudent;
  homeworkReviewId?: string | null;
  shortNote: string;
};

export type TeacherFeedbackDraftForAiResult = {
  risk: 'MEDIUM';
  confirmationRequired: true;
  publishBlocked: true;
  draft: FeedbackDraft;
};

type FeedbackParts = {
  behaviorPerformance: string | null;
  homeworkCompletion: string;
  knowledgeMastery: string | null;
};

const BEHAVIOR_HINTS = ['专注', '纪律', '表现', '提问', '课堂', '配合'];
const HOMEWORK_HINTS = ['作业', '数学', '语文', '英语', '阅读', '完成', '订正'];
const KNOWLEDGE_HINTS = ['掌握', '巩固', '加强', '应用题', '计算', '读题', '知识'];

function splitShortNote(shortNote: string): string[] {
  return shortNote
    .split(/[，,。；;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function hasAnyHint(text: string, hints: readonly string[]): boolean {
  return hints.some((hint) => text.includes(hint));
}

function toAiSentence(text: string): string {
  const normalized = text.replace(/[。.!！?？]+$/g, '').trim();
  return `AI 草稿：${normalized}。`;
}

function buildFeedbackParts(shortNote: string): FeedbackParts {
  const parts = splitShortNote(shortNote);
  const behavior = parts.find((part) => hasAnyHint(part, BEHAVIOR_HINTS));
  const homework = parts.find((part) => hasAnyHint(part, HOMEWORK_HINTS));
  const knowledge = parts.find((part) => hasAnyHint(part, KNOWLEDGE_HINTS) && part !== homework);

  return {
    behaviorPerformance: behavior ? toAiSentence(behavior) : null,
    homeworkCompletion: toAiSentence(homework ?? shortNote.trim()),
    knowledgeMastery: knowledge ? toAiSentence(knowledge) : null,
  };
}

export function createTeacherFeedbackDraftForAi(
  input: TeacherFeedbackDraftForAiInput,
): TeacherFeedbackDraftForAiResult {
  if (
    !canAccessStudent(input.teacher, {
      id: input.student.id,
      campusId: input.student.campusId,
      classId: input.student.classId,
    })
  ) {
    throw new Error('无权为该学生生成反馈草稿');
  }

  const parts = buildFeedbackParts(input.shortNote);

  return {
    risk: 'MEDIUM',
    confirmationRequired: true,
    publishBlocked: true,
    draft: createEditableFeedbackDraft({
      campusId: input.student.campusId,
      classId: input.student.classId ?? null,
      studentId: input.student.id,
      teacherUserId: input.teacher.id,
      homeworkReviewId: input.homeworkReviewId ?? null,
      behaviorPerformance: parts.behaviorPerformance,
      homeworkCompletion: parts.homeworkCompletion,
      knowledgeMastery: parts.knowledgeMastery,
      draftSource: 'AI',
    }),
  };
}
