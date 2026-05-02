import { TeacherMistakeBookPage } from '@/components/teacher/teacher-mistake-book-page';
import type { TeacherMistakeBookRecord } from '@/domain/teacher/mistake-book';

const demoTeacher = {
  id: 'demo-teacher-li',
  role: 'TEACHER' as const,
  teacherAssignments: [{ campusId: 'demo-campus-east', classId: 'demo-class-east-g3' }],
};

const demoMistakeItems: TeacherMistakeBookRecord[] = [
  {
    id: 'mistake-homework-review-wang-demo-area-confirmed',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
    studentId: 'demo-student-profile-wang',
    studentName: '王小明',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    mistakeReason: '进位步骤遗漏',
    questionText: '23 × 14 竖式计算',
    correctionStatus: 'PENDING_CORRECTION',
    createdAt: '2026-05-02T12:30:00.000Z',
  },
  {
    id: 'mistake-west-student-hidden',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    classId: 'demo-class-west-g3',
    className: '西城三年级晚辅 A 班',
    studentId: 'demo-student-profile-west',
    studentName: '赵小西',
    subject: '数学',
    knowledgePoint: '分数比较',
    mistakeReason: '通分错误',
    questionText: '比较 2/3 和 3/5 的大小',
    correctionStatus: 'PENDING_CORRECTION',
    createdAt: '2026-05-02T13:30:00.000Z',
  },
];

export default function TeacherMistakeBookRoute() {
  return <TeacherMistakeBookPage actor={demoTeacher} items={demoMistakeItems} />;
}
