import { ParentHomeworkFeedbackDetail } from '@/components/parent/parent-homework-feedback-detail';
import { createEditableFeedbackDraft } from '@/domain/feedback/feedback';
import {
  getGuardianVisibleHomeworkFeedback,
  publishHomeworkFeedback,
} from '@/domain/feedback/homework-feedback-publishing';
import { createParentHomeworkFeedbackDetail } from '@/domain/parent/homework-feedback-detail';
import { DEMO_SEED } from '@/prisma/seed-data';

const demoGuardian = DEMO_SEED.users.find((user) => user.role === 'GUARDIAN');
const demoTeacher = DEMO_SEED.users.find((user) => user.role === 'TEACHER');
const demoStudent = DEMO_SEED.students[0];

const parentHomeworkDetail = demoGuardian && demoStudent
  ? (() => {
      const published = publishHomeworkFeedback({
        review: {
          id: 'homework-review-wang-demo',
          campusId: demoStudent.campusId,
          classId: demoStudent.classId,
          studentId: demoStudent.id,
          subject: '数学',
          originalImageFileId: 'file-homework-original-wang',
          correctedImageFileId: 'file-homework-corrected-wang',
          publishStatus: 'DRAFT',
          publishedAt: null,
        },
        feedback: createEditableFeedbackDraft({
          campusId: demoStudent.campusId,
          classId: demoStudent.classId,
          studentId: demoStudent.id,
          teacherUserId: demoTeacher?.id ?? 'demo-teacher-li',
          homeworkReviewId: 'homework-review-wang-demo',
          behaviorPerformance: '今天专注度较好，能主动提问。',
          homeworkCompletion: '数学作业已完成，订正 1 处。',
          knowledgeMastery: '两位数乘法仍需巩固。',
          draftSource: 'AI',
        }),
        publishedAt: new Date('2026-05-02T12:00:00.000Z'),
      });

      const guardian = {
        id: demoGuardian.id,
        role: demoGuardian.role,
        guardianStudentIds: DEMO_SEED.guardianStudents
          .filter((binding) => binding.guardianUserId === demoGuardian.id)
          .map((binding) => binding.studentId),
      };

      return createParentHomeworkFeedbackDetail({
        guardian,
        student: demoStudent,
        feedback: getGuardianVisibleHomeworkFeedback({
          guardian,
          review: published.review,
          feedback: published.feedback,
        }),
        attendanceRecords: [
          {
            id: 'attendance-arrival-wang',
            studentId: demoStudent.id,
            status: '已到',
            checkedAt: new Date('2026-05-02T10:30:00.000Z'),
            serviceType: demoStudent.serviceType,
            photoFileId: 'photo://demo-arrival-wang',
          },
          {
            id: 'attendance-leave-wang',
            studentId: demoStudent.id,
            status: '已离校',
            checkedAt: new Date('2026-05-02T20:10:00.000Z'),
            serviceType: demoStudent.serviceType,
            photoFileId: null,
          },
        ],
        mistakeSummaries: [
          {
            id: 'mistake-1',
            reviewId: 'homework-review-wang-demo',
            subject: '数学',
            knowledgePoint: '两位数乘法',
            mistakeReason: '进位步骤遗漏',
            correctionStatus: '待订正',
            source: 'TEACHER_CONFIRMED',
            internalAiConfidence: 0.42,
            teacherInternalNote: '课堂后单独跟进',
          },
          {
            id: 'mistake-ai-draft',
            reviewId: 'homework-review-wang-demo',
            subject: '数学',
            knowledgePoint: '未确认草稿',
            mistakeReason: 'AI 未确认',
            correctionStatus: '待订正',
            source: 'AI_DRAFT',
            internalAiConfidence: 0.93,
            teacherInternalNote: '不要给家长看',
          },
        ],
      });
    })()
  : null;

export default function ParentHomeworkFeedbackPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-text">
      <div className="mx-auto grid max-w-5xl gap-6">
        <ParentHomeworkFeedbackDetail detail={parentHomeworkDetail} />
      </div>
    </main>
  );
}
