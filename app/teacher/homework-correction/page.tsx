import { TeacherHomeworkCorrectionCanvas } from '@/components/teacher/teacher-homework-correction-canvas';
import { TeacherHomeworkFeedbackEditor } from '@/components/teacher/teacher-homework-feedback-editor';
import { TeacherMistakeAreaReviewPanel } from '@/components/teacher/teacher-mistake-area-review-panel';
import { createEditableFeedbackDraft } from '@/domain/feedback/feedback';
import { createHomeworkCorrectionAreaDraft } from '@/domain/homework/correction-canvas';

const demoArea = createHomeworkCorrectionAreaDraft({
  id: 'area-demo-wang-math-1',
  imageNaturalWidth: 1200,
  imageNaturalHeight: 1600,
  displayedWidth: 300,
  displayedHeight: 400,
  displayedBox: { x: 30, y: 80, width: 90, height: 120 },
  mistakeType: '计算错误',
  note: '竖式进位漏写，发布前需老师确认。',
});

const demoAiSuggestedAreas = [
  {
    id: 'ai-area-demo-wang-math-1',
    originalBox: { x: 120, y: 320, width: 360, height: 480 },
    subject: '数学',
    mistakeReason: '竖式进位漏写',
    confidence: 0.86,
    confidenceLevel: 'MEDIUM' as const,
    requiresManualConfirmation: true,
    confirmationHint: 'AI 建议区域，发布前必须老师确认',
  },
];

const demoFeedbackDraft = createEditableFeedbackDraft({
  campusId: 'demo-campus-east',
  classId: 'demo-class-east-grade3-a',
  studentId: 'demo-student-profile-wang',
  teacherUserId: 'demo-teacher-zhao',
  homeworkReviewId: 'homework-review-wang-demo',
  behaviorPerformance: 'AI 草稿：今天专注度较好，能主动提问。',
  homeworkCompletion: 'AI 草稿：数学作业已完成，订正 1 处。',
  knowledgeMastery: 'AI 草稿：两位数乘法仍需巩固。',
  draftSource: 'AI',
});

export default function TeacherHomeworkCorrectionPage() {
  return (
    <main aria-label="老师作业批改工作台" className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <TeacherHomeworkCorrectionCanvas
          review={{
            id: 'homework-review-wang-demo',
            studentName: '王小明',
            subject: '数学',
            originalImageUrl: '/demo/homework-wang-math.jpg',
            originalImageFileId: 'file-homework-original-wang',
            imageNaturalWidth: 1200,
            imageNaturalHeight: 1600,
            areas: [demoArea],
          }}
        />

        <TeacherMistakeAreaReviewPanel
          reviewId="homework-review-wang-demo"
          aiSuggestedAreas={demoAiSuggestedAreas}
        />

        <TeacherHomeworkFeedbackEditor draft={demoFeedbackDraft} />

        <section aria-label="发布与练习单操作区" className="rounded-[2rem] bg-surface p-5 shadow-neu-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-muted">Publish & Practice Sheet</p>
              <h2 className="text-xl font-bold">发布与练习单</h2>
              <p className="mt-2 text-sm text-muted">发布后自动收录错题，并可进入错题本生成 Word 练习单</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="inline-flex min-h-11 items-center rounded-full bg-mint px-5 py-2 text-sm font-bold shadow-neu-sm" href="/parent/homework-feedback">
                查看发布结果
              </a>
              <a className="inline-flex min-h-11 items-center rounded-full bg-lavender px-5 py-2 text-sm font-bold shadow-neu-sm" href="/teacher/practice-sheet">
                进入练习单生成
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
