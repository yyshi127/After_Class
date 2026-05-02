import { TeacherTodayCustodyPage } from '@/components/teacher/teacher-today-custody-page';
import { createTeacherFeedbackDraftForAi } from '@/domain/ai-command/teacher-feedback-draft';
import type { TeacherTodayCustodyRecord } from '@/domain/teacher/today-custody';

const demoTeacher = {
  id: 'demo-teacher-li',
  role: 'TEACHER' as const,
  teacherAssignments: [{ campusId: 'demo-campus-east', classId: 'demo-class-east-g3' }],
};

const demoRecords: TeacherTodayCustodyRecord[] = [
  {
    id: 'demo-student-profile-wang',
    studentName: '王小明',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    serviceType: '晚辅导',
    attendanceStatus: '待确认',
    serviceExpiresAt: '2026-05-06',
  },
  {
    id: 'demo-student-profile-west',
    studentName: '赵小西',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    classId: 'demo-class-west-g3',
    className: '西城三年级晚辅 A 班',
    serviceType: '晚辅导',
    attendanceStatus: '已到',
    serviceExpiresAt: '2026-06-30',
  },
];

const teacherFeedbackDraft = createTeacherFeedbackDraftForAi({
  teacher: demoTeacher,
  student: {
    id: 'demo-student-profile-wang',
    name: '王小明',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
  },
  homeworkReviewId: 'homework-review-wang-demo',
  shortNote: '作业完成较好，课堂专注，能主动提问，计算知识还要巩固',
});

export default function TeacherPage() {
  return (
    <>
      <TeacherTodayCustodyPage actor={demoTeacher} records={demoRecords} today="2026-05-02" />
      <section
        aria-label="老师 AI 反馈草稿确认卡片"
        className="mx-auto mb-10 max-w-6xl rounded-neu bg-surface p-6 text-text shadow-neu"
      >
        <p className="text-sm font-semibold text-primary">AI 反馈草稿</p>
        <h2 className="mt-2 font-heading text-2xl font-bold">老师确认后才可进入发布流程</h2>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-muted md:grid-cols-3">
          <article className="rounded-2xl bg-background/70 p-4">
            <h3 className="font-semibold text-text">作业完成</h3>
            <p>{teacherFeedbackDraft.draft.homeworkCompletion}</p>
          </article>
          <article className="rounded-2xl bg-background/70 p-4">
            <h3 className="font-semibold text-text">行为表现</h3>
            <p>{teacherFeedbackDraft.draft.behaviorPerformance}</p>
            <p>补充建议：AI 草稿：课堂专注，能主动提问。</p>
          </article>
          <article className="rounded-2xl bg-background/70 p-4">
            <h3 className="font-semibold text-text">知识掌握</h3>
            <p>{teacherFeedbackDraft.draft.knowledgeMastery}</p>
          </article>
        </div>
        <p className="mt-4 text-sm font-semibold text-amber-700">
          发布状态：草稿；家长不可见，需老师编辑确认后发布。
        </p>
      </section>
    </>
  );
}
