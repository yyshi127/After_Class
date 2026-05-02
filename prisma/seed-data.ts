import type { Role, ServiceType } from '@/domain/shared/enums';

type SeedUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
};

type SeedCampus = {
  id: string;
  name: string;
  address: string;
  phone: string;
  principalName: string;
  status: 'ACTIVE' | 'INACTIVE';
  serviceHours: string;
  supportedServiceTypes: readonly ServiceType[];
};

type SeedClass = {
  id: string;
  campusId: string;
  grade: string;
  name: string;
  capacity: number;
};

type SeedStudent = {
  id: string;
  userId: string;
  name: string;
  identityNumber: string;
  school: string;
  grade: string;
  campusId: string;
  classId: string;
  serviceType: ServiceType;
  status: 'ACTIVE';
  safetyNote: string;
};

type SeedGuardianStudent = {
  guardianUserId: string;
  studentId: string;
  relationship: string;
  phone: string;
  notifyEnabled: boolean;
};

type SeedTeacherAssignment = {
  teacherUserId: string;
  campusId: string;
  classId: string;
};

export const DEMO_SEED: {
  serviceTypes: readonly ServiceType[];
  users: readonly SeedUser[];
  campuses: readonly SeedCampus[];
  classes: readonly SeedClass[];
  students: readonly SeedStudent[];
  guardianStudents: readonly SeedGuardianStudent[];
  teacherAssignments: readonly SeedTeacherAssignment[];
} = {
  serviceTypes: ['中午托', '下午托', '晚辅导', '晚全托'],
  users: [
    { id: 'demo-super-admin', name: '总部管理员', email: 'super.admin@afterclass.local', role: 'SUPER_ADMIN', phone: '13800000001' },
    { id: 'demo-campus-admin-east', name: '东城校区管理员', email: 'east.admin@afterclass.local', role: 'CAMPUS_ADMIN', phone: '13800000002' },
    { id: 'demo-teacher-li', name: '李老师', email: 'teacher.li@afterclass.local', role: 'TEACHER', phone: '13800000003' },
    { id: 'demo-guardian-wang', name: '王小明家长', email: 'guardian.wang@afterclass.local', role: 'GUARDIAN', phone: '13800000004' },
    { id: 'demo-student-wang', name: '王小明', email: 'student.wang@afterclass.local', role: 'STUDENT', phone: '13800000005' },
  ],
  campuses: [
    {
      id: 'demo-campus-east',
      name: '东城托管中心',
      address: '东城区育才路 18 号',
      phone: '010-10000001',
      principalName: '陈校长',
      status: 'ACTIVE',
      serviceHours: '周一至周五 11:30-21:00',
      supportedServiceTypes: ['中午托', '下午托', '晚辅导', '晚全托'],
    },
    {
      id: 'demo-campus-west',
      name: '西城托管中心',
      address: '西城区成长路 9 号',
      phone: '010-10000002',
      principalName: '赵校长',
      status: 'ACTIVE',
      serviceHours: '周一至周五 13:30-21:00',
      supportedServiceTypes: ['下午托', '晚辅导', '晚全托'],
    },
  ],
  classes: [
    { id: 'demo-class-east-g3', campusId: 'demo-campus-east', grade: '三年级', name: '东城三年级晚辅 A 班', capacity: 24 },
  ],
  students: [
    {
      id: 'demo-student-profile-wang',
      userId: 'demo-student-wang',
      name: '王小明',
      identityNumber: '310101201001013218',
      school: '育才小学',
      grade: '三年级',
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-g3',
      serviceType: '晚辅导',
      status: 'ACTIVE',
      safetyNote: '放学后需家长本人接送。',
    },
  ],
  guardianStudents: [
    {
      guardianUserId: 'demo-guardian-wang',
      studentId: 'demo-student-profile-wang',
      relationship: '母亲',
      phone: '13800000004',
      notifyEnabled: true,
    },
  ],
  teacherAssignments: [
    { teacherUserId: 'demo-teacher-li', campusId: 'demo-campus-east', classId: 'demo-class-east-g3' },
  ],
};
