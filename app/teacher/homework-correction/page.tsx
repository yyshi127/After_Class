import { TeacherHomeworkCorrectionCanvas } from '@/components/teacher/teacher-homework-correction-canvas';
import { TeacherMistakeAreaReviewPanel } from '@/components/teacher/teacher-mistake-area-review-panel';
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

export default function TeacherHomeworkCorrectionPage() {
  return (
    <>
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
      <div className="bg-background px-6 pb-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <TeacherMistakeAreaReviewPanel
            reviewId="homework-review-wang-demo"
            aiSuggestedAreas={demoAiSuggestedAreas}
          />
        </div>
      </div>
    </>
  );
}
