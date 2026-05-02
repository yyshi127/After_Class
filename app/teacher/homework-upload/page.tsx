import { TeacherHomeworkUploadPage } from '@/components/teacher/teacher-homework-upload-page';
import type { TeacherHomeworkUploadStudent } from '@/domain/teacher/homework-upload';

const demoTeacher = {
  id: 'demo-teacher-li',
  role: 'TEACHER' as const,
  teacherAssignments: [{ campusId: 'demo-campus-east', classId: 'demo-class-east-g3' }],
};

const demoStudents: TeacherHomeworkUploadStudent[] = [
  {
    id: 'demo-student-profile-wang',
    studentName: '王小明',
    campusId: 'demo-campus-east',
    campusName: '东城托管中心',
    classId: 'demo-class-east-g3',
    className: '东城三年级晚辅 A 班',
  },
  {
    id: 'demo-student-profile-west',
    studentName: '赵小西',
    campusId: 'demo-campus-west',
    campusName: '西城托管中心',
    classId: 'demo-class-west-g3',
    className: '西城三年级晚辅 A 班',
  },
];

export default function TeacherHomeworkUploadRoute() {
  return <TeacherHomeworkUploadPage actor={demoTeacher} students={demoStudents} />;
}
