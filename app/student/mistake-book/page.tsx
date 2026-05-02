import { StudentMistakeBookPage } from '@/components/student/student-mistake-book-page';
import type { StudentMistakeBookRecord } from '@/domain/student/mistake-book';

const demoStudent = {
  id: 'demo-student-user-wang',
  role: 'STUDENT' as const,
};

const demoMistakeItems: StudentMistakeBookRecord[] = [
  {
    id: 'mistake-wang-multiply',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
    studentId: 'demo-student-profile-wang',
    studentUserId: 'demo-student-user-wang',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    mistakeReason: '进位步骤遗漏',
    questionText: '23 × 14 竖式计算',
    correctionStatus: 'PENDING_CORRECTION',
    createdAt: '2026-05-02T12:30:00.000Z',
  },
  {
    id: 'mistake-li-sentence',
    campusId: 'demo-campus-east',
    classId: 'demo-class-east-g3',
    studentId: 'demo-student-profile-li',
    studentUserId: 'demo-student-user-li',
    subject: '语文',
    knowledgePoint: '病句修改',
    mistakeReason: '主谓搭配不当',
    questionText: '修改病句：同学们认真地讨论并听取了建议。',
    correctionStatus: 'CORRECTED',
    createdAt: '2026-05-02T13:00:00.000Z',
  },
];

export default function StudentMistakeBookRoute() {
  return <StudentMistakeBookPage actor={demoStudent} items={demoMistakeItems} />;
}
