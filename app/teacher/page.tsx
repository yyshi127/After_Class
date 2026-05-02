import { TeacherTodayCustodyPage } from '@/components/teacher/teacher-today-custody-page';
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

export default function TeacherPage() {
  return <TeacherTodayCustodyPage actor={demoTeacher} records={demoRecords} today="2026-05-02" />;
}
