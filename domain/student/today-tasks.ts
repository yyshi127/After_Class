import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import type { MistakeCorrectionStatus } from '@/domain/mistake-book/mistake-book-item';

export type StudentTodayTaskSource = {
  id: string;
  campusId: string;
  classId: string;
  studentId: string;
  studentUserId: string;
  title: string;
  subject: string;
  status: 'COMPLETED' | 'PENDING' | 'PENDING_CORRECTION';
};

export type StudentTodayMistakeSource = {
  id: string;
  campusId: string;
  classId: string;
  studentId: string;
  studentUserId: string;
  subject: string;
  knowledgePoint: string;
  correctionStatus: MistakeCorrectionStatus;
};

export type StudentTodayTaskSummary = {
  studentName: string;
  completedCount: number;
  totalCount: number;
  progressLabel: string;
  encouragement: string;
  tasks: StudentTodayTaskSource[];
  pendingCorrections: StudentTodayMistakeSource[];
  aiLearningEntryLabel: string;
};

export function getStudentTodayTaskSummary({
  actor,
  studentName,
  tasks,
  mistakes,
}: {
  actor: PermissionActor;
  studentName: string;
  tasks: readonly StudentTodayTaskSource[];
  mistakes: readonly StudentTodayMistakeSource[];
}): StudentTodayTaskSummary {
  const visibleTasks = tasks.filter((task) => canAccessStudent(actor, toStudentAccessTarget(task)));
  const visibleMistakes = mistakes.filter((mistake) => canAccessStudent(actor, toStudentAccessTarget(mistake)));
  const completedCount = visibleTasks.filter((task) => task.status === 'COMPLETED').length;
  const totalCount = visibleTasks.length;

  return {
    studentName,
    completedCount,
    totalCount,
    progressLabel: totalCount === 0 ? '今日暂无任务' : `已完成 ${completedCount}/${totalCount}`,
    encouragement: completedCount === totalCount && totalCount > 0 ? '今天保持得很好，继续巩固错题。' : '先完成待办，再订正错题，稳稳进步。',
    tasks: visibleTasks,
    pendingCorrections: visibleMistakes.filter((mistake) => mistake.correctionStatus === 'PENDING_CORRECTION'),
    aiLearningEntryLabel: 'AI 学习助手',
  };
}

function toStudentAccessTarget(item: StudentTodayTaskSource | StudentTodayMistakeSource) {
  return {
    id: item.studentId,
    campusId: item.campusId,
    classId: item.classId,
    userId: item.studentUserId,
  };
}

export function formatStudentTaskStatus(status: StudentTodayTaskSource['status']): string {
  if (status === 'COMPLETED') return '已完成';
  if (status === 'PENDING_CORRECTION') return '待订正';
  return '待完成';
}
