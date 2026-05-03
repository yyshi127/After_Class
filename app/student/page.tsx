import { StudentTodayTasksPage } from '@/components/student/student-today-tasks-page';
import { getStudentTodayTaskSummary, type StudentTodayMistakeSource, type StudentTodayTaskSource } from '@/domain/student/today-tasks';

const demoStudent = {
  id: 'demo-student-user-wang',
  role: 'STUDENT' as const,
};

const demoTasks: StudentTodayTaskSource[] = [
  {
    id: 'task-math-calculation',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
    studentId: 'demo-student-profile-wang',
    studentUserId: 'demo-student-user-wang',
    title: '完成数学计算练习第 3 页',
    subject: '数学',
    status: 'COMPLETED',
  },
  {
    id: 'task-english-reading',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
    studentId: 'demo-student-profile-wang',
    studentUserId: 'demo-student-user-wang',
    title: '英语阅读打卡 15 分钟',
    subject: '英语',
    status: 'PENDING',
  },
  {
    id: 'task-other-student',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
    studentId: 'demo-student-profile-li',
    studentUserId: 'demo-student-user-li',
    title: '其他同学的语文背诵',
    subject: '语文',
    status: 'PENDING',
  },
];

const demoMistakes: StudentTodayMistakeSource[] = [
  {
    id: 'mistake-wang-multiply',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
    studentId: 'demo-student-profile-wang',
    studentUserId: 'demo-student-user-wang',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    correctionStatus: 'PENDING_CORRECTION',
  },
  {
    id: 'mistake-wang-punctuation',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
    studentId: 'demo-student-profile-wang',
    studentUserId: 'demo-student-user-wang',
    subject: '语文',
    knowledgePoint: '标点使用',
    correctionStatus: 'CORRECTED',
  },
  {
    id: 'mistake-li-sentence',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
    studentId: 'demo-student-profile-li',
    studentUserId: 'demo-student-user-li',
    subject: '语文',
    knowledgePoint: '其他同学的病句修改',
    correctionStatus: 'PENDING_CORRECTION',
  },
];

export default function StudentPage() {
  const summary = getStudentTodayTaskSummary({
    actor: demoStudent,
    studentName: '王同学',
    tasks: demoTasks,
    mistakes: demoMistakes,
  });

  return <StudentTodayTasksPage summary={summary} />;
}
