import { ParentHomeSafetyCard } from '@/components/parent/parent-home-safety-card';
import { ParentHomeworkFeedbackCard } from '@/components/parent/parent-homework-feedback-card';
import { ParentMistakeSummaryCard } from '@/components/parent/parent-mistake-summary-card';
import { ParentServiceValidityCard } from '@/components/parent/parent-service-validity-card';
import { confirmRequest } from '@/domain/ai-command/confirmation-request';
import {
  buildGuardianLeaveConfirmationRequest,
  createLeaveAttendanceDraftFromConfirmation,
} from '@/domain/ai-command/guardian-leave-request';
import { getGuardianVisibleServiceValidity } from '@/domain/billing/service-validity';
import { createEditableFeedbackDraft } from '@/domain/feedback/feedback';
import {
  getGuardianVisibleHomeworkFeedback,
  publishHomeworkFeedback,
} from '@/domain/feedback/homework-feedback-publishing';
import { getParentSafetyArrivalCards } from '@/domain/parent/safety-arrival';
import { getParentVisibleMistakeSummaries } from '@/domain/parent/mistake-summary';
import { DEMO_SEED } from '@/prisma/seed-data';

const demoGuardian = DEMO_SEED.users.find((user) => user.role === 'GUARDIAN');
const demoTeacher = DEMO_SEED.users.find((user) => user.role === 'TEACHER');
const demoStudent = DEMO_SEED.students[0];

const safetyCards = demoGuardian
  ? getParentSafetyArrivalCards({
      actor: {
        id: demoGuardian.id,
        role: demoGuardian.role,
        guardianStudentIds: DEMO_SEED.guardianStudents
          .filter((binding) => binding.guardianUserId === demoGuardian.id)
          .map((binding) => binding.studentId),
      },
      students: DEMO_SEED.students,
      teachers: demoTeacher ? [{ id: demoTeacher.id, name: demoTeacher.name }] : [],
      attendanceRecords: demoStudent
        ? [
            {
              id: 'demo-attendance-arrival-wang',
              campusId: demoStudent.campusId,
              classId: demoStudent.classId,
              studentId: demoStudent.id,
              teacherUserId: demoTeacher?.id ?? null,
              serviceType: demoStudent.serviceType,
              status: '已到',
              checkedAt: new Date('2026-05-02T10:30:00.000Z'),
              photoFileId: 'photo://demo-arrival-wang',
              matchStatus: 'MATCHED',
              notificationStatus: 'SENT',
            },
          ]
        : [],
    })
  : [];

const publishedHomeworkFeedback = demoGuardian && demoStudent
  ? publishHomeworkFeedback({
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
        teacherUserId: demoTeacher?.id ?? 'demo-teacher-zhao',
        homeworkReviewId: 'homework-review-wang-demo',
        behaviorPerformance: '今天专注度较好，能主动提问。',
        homeworkCompletion: '数学作业已完成，订正 1 处。',
        knowledgeMastery: '两位数乘法仍需巩固。',
        draftSource: 'AI',
      }),
      publishedAt: new Date('2026-05-02T12:00:00.000Z'),
    })
  : null;

const parentHomeworkFeedback = demoGuardian && publishedHomeworkFeedback
  ? getGuardianVisibleHomeworkFeedback({
      guardian: {
        id: demoGuardian.id,
        role: demoGuardian.role,
        guardianStudentIds: DEMO_SEED.guardianStudents
          .filter((binding) => binding.guardianUserId === demoGuardian.id)
          .map((binding) => binding.studentId),
      },
      review: publishedHomeworkFeedback.review,
      feedback: publishedHomeworkFeedback.feedback,
    })
  : null;

const parentServiceValidities = demoGuardian && demoStudent
  ? getGuardianVisibleServiceValidity({
      guardian: {
        id: demoGuardian.id,
        role: demoGuardian.role,
        guardianStudentIds: DEMO_SEED.guardianStudents
          .filter((binding) => binding.guardianUserId === demoGuardian.id)
          .map((binding) => binding.studentId),
      },
      records: [
        {
          id: 'billing-wang-demo-202605',
          campusId: demoStudent.campusId,
          studentId: demoStudent.id,
          studentName: demoStudent.name,
          serviceType: demoStudent.serviceType,
          billingCycle: 'MONTHLY',
          periodStart: new Date('2026-05-01T00:00:00.000Z'),
          periodEnd: new Date('2026-05-31T23:59:59.000Z'),
          amountDue: 1800,
          amountPaid: 1800,
          balanceAmount: 0,
          debtAmount: 0,
          validUntil: new Date('2026-05-31T23:59:59.000Z'),
        },
      ],
    })
  : [];

const parentMistakeSummaries = demoGuardian
  ? getParentVisibleMistakeSummaries({
      guardian: {
        id: demoGuardian.id,
        role: demoGuardian.role,
        guardianStudentIds: DEMO_SEED.guardianStudents
          .filter((binding) => binding.guardianUserId === demoGuardian.id)
          .map((binding) => binding.studentId),
      },
      mistakeItems: demoStudent
        ? [
            {
              id: 'mistake-wang-1',
              campusId: demoStudent.campusId,
              classId: demoStudent.classId,
              studentId: demoStudent.id,
              studentName: demoStudent.name,
              subject: '数学',
              knowledgePoint: '两位数乘法',
              mistakeReason: '进位步骤遗漏',
              correctionStatus: 'PENDING_CORRECTION',
              aiConfidence: 0.91,
              createdAt: '2026-05-02T12:00:00.000Z',
            },
          ]
        : [],
    })
  : [];

const guardianLeaveConfirmation = demoGuardian && demoStudent
  ? buildGuardianLeaveConfirmationRequest({
      id: 'demo-ai-leave-confirmation-wang',
      actor: {
        id: demoGuardian.id,
        role: demoGuardian.role,
        guardianStudentIds: DEMO_SEED.guardianStudents
          .filter((binding) => binding.guardianUserId === demoGuardian.id)
          .map((binding) => binding.studentId),
      },
      rawInput: '明天晚辅导请假，孩子发烧',
      now: new Date('2026-05-03T10:00:00.000Z'),
      entities: {
        studentId: demoStudent.id,
        studentName: demoStudent.name,
        campusId: demoStudent.campusId,
        classId: demoStudent.classId,
        serviceType: demoStudent.serviceType,
        leaveDate: '2026-05-04',
        reason: '孩子发烧',
      },
    })
  : null;

const confirmedGuardianLeave = guardianLeaveConfirmation && demoGuardian
  ? confirmRequest(guardianLeaveConfirmation, {
      confirmedByUserId: demoGuardian.id,
      confirmedAt: new Date('2026-05-03T10:01:00.000Z'),
    })
  : null;

const guardianLeaveAttendanceDraft = confirmedGuardianLeave
  ? createLeaveAttendanceDraftFromConfirmation({ request: confirmedGuardianLeave })
  : null;

export default function ParentPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-text">
      <div className="mx-auto grid max-w-5xl gap-6">
        <section className="rounded-neu bg-surface p-8 shadow-neu">
          <p className="mb-3 text-sm font-semibold text-muted">Parent Portal</p>
          <h1 className="mb-4 font-heading text-3xl font-bold">家长端首页</h1>
          <p className="max-w-2xl text-muted">查看孩子到托安全状态、考勤时间线、作业反馈和服务有效期提醒。</p>
        </section>

        <ParentHomeSafetyCard cards={safetyCards} />
        {guardianLeaveConfirmation && guardianLeaveAttendanceDraft ? (
          <section
            aria-label="家长 AI 请假确认卡片"
            className="rounded-neu bg-surface p-6 shadow-neu"
          >
            <p className="text-sm font-semibold text-primary">AI 请假确认</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">请确认 AI 生成的请假申请</h2>
            <div className="mt-4 rounded-2xl bg-background/70 p-4 text-sm leading-6 text-muted">
              <p>原始指令：{guardianLeaveConfirmation.rawInput}</p>
              <p>{guardianLeaveConfirmation.summary}</p>
              <p>确认前不会创建请假记录，也不会通知老师。</p>
              <p>确认后状态：{guardianLeaveAttendanceDraft.status}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-soft" type="button">
                确认创建请假申请
              </button>
              <button className="rounded-full border border-border px-4 py-3 text-sm font-semibold text-muted" type="button">
                取消
              </button>
            </div>
          </section>
        ) : null}
        <ParentServiceValidityCard validities={parentServiceValidities} />
        <ParentHomeworkFeedbackCard feedback={parentHomeworkFeedback} />
        <ParentMistakeSummaryCard summaries={parentMistakeSummaries} />
      </div>
    </main>
  );
}
