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
  id: string;
  guardianUserId: string;
  studentId: string;
  relationship: string;
  phone: string;
  notifyEnabled: boolean;
};

type SeedTeacherAssignment = {
  id: string;
  teacherUserId: string;
  campusId: string;
  classId: string;
};

type SeedPrivateFile = {
  id: string;
  campusId: string;
  studentId: string;
  uploadedByUserId: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  byteSize: number;
  purpose: 'ARRIVAL_PHOTO' | 'HOMEWORK_ORIGINAL' | 'HOMEWORK_CORRECTED' | 'PRACTICE_DOCX';
};

type SeedAttendanceRecord = {
  id: string;
  campusId: string;
  classId: string;
  studentId: string;
  teacherUserId: string;
  serviceType: ServiceType;
  status: '已到' | '请假' | '缺勤' | '迟到' | '已离托' | '待确认';
  checkedAt: string;
  photoFileId: string;
  matchStatus: 'MATCHED' | 'PENDING_CONFIRMATION' | 'FAILED';
  notificationStatus: 'PENDING' | 'SENT' | 'SUPPRESSED' | 'FAILED';
};

type SeedTeacherAttendance = {
  id: string;
  teacherUserId: string;
  campusId: string;
  classId: string;
  status: '已签到' | '已签退' | '迟到' | '早退' | '请假' | '缺勤' | '补签';
  checkedInAt: string;
  checkedOutAt: string;
};

type SeedParentNotice = {
  id: string;
  campusId: string;
  guardianUserId: string;
  studentId: string;
  attendanceRecordId: string;
  photoFileId: string;
  type: string;
  title: string;
  message: string;
  pushStatus: 'PENDING' | 'SENT' | 'SUPPRESSED' | 'FAILED';
  sentAt: string;
};

type SeedHomeworkReview = {
  id: string;
  campusId: string;
  classId: string;
  studentId: string;
  teacherUserId: string;
  originalImageFileId: string;
  correctedImageFileId: string;
  subject: string;
  status: 'UPLOADED' | 'AI_SUGGESTED' | 'TEACHER_REVIEWED';
  aiSuggestedAreas: readonly Record<string, unknown>[];
  teacherConfirmedAreas: readonly Record<string, unknown>[];
  publishStatus: 'DRAFT' | 'PUBLISHED';
  publishedAt: string;
};

type SeedFeedback = {
  id: string;
  campusId: string;
  classId: string;
  studentId: string;
  teacherUserId: string;
  homeworkReviewId: string;
  behaviorPerformance: string;
  homeworkCompletion: string;
  knowledgeMastery: string;
  publishStatus: 'DRAFT' | 'PUBLISHED';
  publishedAt: string;
};

type SeedMistakeBookItem = {
  id: string;
  campusId: string;
  classId: string;
  studentId: string;
  homeworkReviewId: string;
  sourceAreaId: string;
  subject: string;
  knowledgePoint: string;
  mistakeReason: string;
  imageRegion: Record<string, unknown>;
  questionText: string;
  correctionStatus: 'PENDING_CORRECTION' | 'CORRECTED' | 'MASTERED';
  aiConfidence: number;
};

type SeedBillingRecord = {
  id: string;
  campusId: string;
  studentId: string;
  classId: string;
  serviceType: ServiceType;
  billingCycle: 'MONTHLY' | 'SEMESTER';
  periodStart: string;
  periodEnd: string;
  amountDue: string;
  amountPaid: string;
  balanceAmount: string;
  debtAmount: string;
  validUntil: string;
};

type SeedTeacherFeeRule = {
  id: string;
  campusId: string;
  classId: string;
  teacherUserId: string;
  serviceType: ServiceType;
  billingMode: 'CLASS_FIXED' | 'DAILY_FIXED';
  feeAmount: string;
  effectiveFrom: string;
};

type SeedClassSettlement = {
  id: string;
  campusId: string;
  classId: string;
  serviceType: ServiceType;
  settlementDate: string;
  expectedCount: number;
  arrivedCount: number;
  leaveCount: number;
  absentCount: number;
  pendingCount: number;
  studentRevenueAmount: string;
  teacherFeeAmount: string;
  reservedCostAmount: string;
  estimatedGrossProfitAmount: string;
  teacherFeeRuleIds: readonly string[];
};

type SeedAiActionLog = {
  id: string;
  actorUserId: string;
  actorRole: Role;
  rawInput: string;
  intent: 'queryAttendance' | 'queryHomework' | 'createLeaveRequest' | 'queryBilling' | 'sendTeacherMessage' | 'recordHomeworkFeedback' | 'suggestMistakeAreas' | 'generateSimilarQuestions' | 'queryClassSettlement';
  entities: Record<string, unknown>;
  confidence: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  confirmationRequired: boolean;
  resultStatus: 'DRAFTED' | 'CONFIRMATION_REQUIRED' | 'EXECUTED' | 'REJECTED' | 'FAILED';
  resultSummary: string;
};

export const DEMO_SEED: {
  serviceTypes: readonly ServiceType[];
  users: readonly SeedUser[];
  campuses: readonly SeedCampus[];
  classes: readonly SeedClass[];
  students: readonly SeedStudent[];
  guardianStudents: readonly SeedGuardianStudent[];
  teacherAssignments: readonly SeedTeacherAssignment[];
  privateFiles: readonly SeedPrivateFile[];
  attendanceRecords: readonly SeedAttendanceRecord[];
  teacherAttendance: readonly SeedTeacherAttendance[];
  parentNotices: readonly SeedParentNotice[];
  homeworkReviews: readonly SeedHomeworkReview[];
  feedbacks: readonly SeedFeedback[];
  mistakeBookItems: readonly SeedMistakeBookItem[];
  billingRecords: readonly SeedBillingRecord[];
  teacherFeeRules: readonly SeedTeacherFeeRule[];
  classSettlements: readonly SeedClassSettlement[];
  aiActionLogs: readonly SeedAiActionLog[];
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
      id: 'demo-guardian-binding-wang',
      guardianUserId: 'demo-guardian-wang',
      studentId: 'demo-student-profile-wang',
      relationship: '母亲',
      phone: '13800000004',
      notifyEnabled: true,
    },
  ],
  teacherAssignments: [
    { id: 'demo-teacher-assignment-li-east-g3', teacherUserId: 'demo-teacher-li', campusId: 'demo-campus-east', classId: 'demo-class-east-g3' },
  ],
  privateFiles: [
    { id: 'demo-file-arrival-photo', campusId: 'demo-campus-east', studentId: 'demo-student-profile-wang', uploadedByUserId: 'demo-teacher-li', originalName: 'arrival-wang.jpg', storageKey: 'demo/private/arrival-wang.jpg', mimeType: 'image/jpeg', byteSize: 128000, purpose: 'ARRIVAL_PHOTO' },
    { id: 'demo-file-homework-original', campusId: 'demo-campus-east', studentId: 'demo-student-profile-wang', uploadedByUserId: 'demo-teacher-li', originalName: 'math-original.jpg', storageKey: 'demo/private/math-original.jpg', mimeType: 'image/jpeg', byteSize: 256000, purpose: 'HOMEWORK_ORIGINAL' },
    { id: 'demo-file-homework-corrected', campusId: 'demo-campus-east', studentId: 'demo-student-profile-wang', uploadedByUserId: 'demo-teacher-li', originalName: 'math-corrected.jpg', storageKey: 'demo/private/math-corrected.jpg', mimeType: 'image/jpeg', byteSize: 260000, purpose: 'HOMEWORK_CORRECTED' },
    { id: 'demo-file-practice-docx', campusId: 'demo-campus-east', studentId: 'demo-student-profile-wang', uploadedByUserId: 'demo-teacher-li', originalName: 'practice-wang.docx', storageKey: 'demo/private/practice-wang.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', byteSize: 64000, purpose: 'PRACTICE_DOCX' },
  ],
  attendanceRecords: [
    { id: 'demo-attendance-arrival-wang', campusId: 'demo-campus-east', classId: 'demo-class-east-g3', studentId: 'demo-student-profile-wang', teacherUserId: 'demo-teacher-li', serviceType: '晚辅导', status: '已到', checkedAt: '2026-05-03T16:02:00.000Z', photoFileId: 'demo-file-arrival-photo', matchStatus: 'MATCHED', notificationStatus: 'SENT' },
  ],
  teacherAttendance: [
    { id: 'demo-teacher-attendance-li', teacherUserId: 'demo-teacher-li', campusId: 'demo-campus-east', classId: 'demo-class-east-g3', status: '已签退', checkedInAt: '2026-05-03T15:30:00.000Z', checkedOutAt: '2026-05-03T21:05:00.000Z' },
  ],
  parentNotices: [
    { id: 'demo-parent-notice-arrival-wang', campusId: 'demo-campus-east', guardianUserId: 'demo-guardian-wang', studentId: 'demo-student-profile-wang', attendanceRecordId: 'demo-attendance-arrival-wang', photoFileId: 'demo-file-arrival-photo', type: 'ARRIVAL', title: '王小明已到托管中心', message: '王小明 16:02 已到托管中心，李老师已拍照确认。', pushStatus: 'SENT', sentAt: '2026-05-03T16:03:00.000Z' },
  ],
  homeworkReviews: [
    {
      id: 'demo-homework-review-wang-math',
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-g3',
      studentId: 'demo-student-profile-wang',
      teacherUserId: 'demo-teacher-li',
      originalImageFileId: 'demo-file-homework-original',
      correctedImageFileId: 'demo-file-homework-corrected',
      subject: '数学',
      status: 'TEACHER_REVIEWED',
      aiSuggestedAreas: [{ id: 'area-fraction-1', x: 120, y: 220, width: 180, height: 90, reason: '分数通分步骤遗漏', confidence: 0.82 }],
      teacherConfirmedAreas: [{ id: 'area-fraction-1', x: 120, y: 220, width: 180, height: 90, reason: '分数通分步骤遗漏', knowledgePoint: '分数加减法' }],
      publishStatus: 'PUBLISHED',
      publishedAt: '2026-05-03T19:30:00.000Z',
    },
  ],
  feedbacks: [
    { id: 'demo-feedback-wang-math', campusId: 'demo-campus-east', classId: 'demo-class-east-g3', studentId: 'demo-student-profile-wang', teacherUserId: 'demo-teacher-li', homeworkReviewId: 'demo-homework-review-wang-math', behaviorPerformance: '今日专注度较好，能主动询问错题。', homeworkCompletion: '数学作业已完成并完成订正。', knowledgeMastery: '分数通分仍需巩固，已加入错题练习。', publishStatus: 'PUBLISHED', publishedAt: '2026-05-03T19:35:00.000Z' },
  ],
  mistakeBookItems: [
    { id: 'demo-mistake-fraction-wang', campusId: 'demo-campus-east', classId: 'demo-class-east-g3', studentId: 'demo-student-profile-wang', homeworkReviewId: 'demo-homework-review-wang-math', sourceAreaId: 'area-fraction-1', subject: '数学', knowledgePoint: '分数加减法', mistakeReason: '通分后分子计算错误', imageRegion: { x: 120, y: 220, width: 180, height: 90 }, questionText: '计算 1/3 + 1/6', correctionStatus: 'PENDING_CORRECTION', aiConfidence: 0.82 },
  ],
  billingRecords: [
    { id: 'demo-billing-wang-may', campusId: 'demo-campus-east', studentId: 'demo-student-profile-wang', classId: 'demo-class-east-g3', serviceType: '晚辅导', billingCycle: 'MONTHLY', periodStart: '2026-05-01T00:00:00.000Z', periodEnd: '2026-05-31T23:59:59.000Z', amountDue: '1800.00', amountPaid: '1800.00', balanceAmount: '0.00', debtAmount: '0.00', validUntil: '2026-05-31T23:59:59.000Z' },
  ],
  teacherFeeRules: [
    { id: 'demo-teacher-fee-rule-li', campusId: 'demo-campus-east', classId: 'demo-class-east-g3', teacherUserId: 'demo-teacher-li', serviceType: '晚辅导', billingMode: 'DAILY_FIXED', feeAmount: '260.00', effectiveFrom: '2026-05-01T00:00:00.000Z' },
  ],
  classSettlements: [
    { id: 'demo-settlement-east-g3-20260503', campusId: 'demo-campus-east', classId: 'demo-class-east-g3', serviceType: '晚辅导', settlementDate: '2026-05-03T00:00:00.000Z', expectedCount: 1, arrivedCount: 1, leaveCount: 0, absentCount: 0, pendingCount: 0, studentRevenueAmount: '90.00', teacherFeeAmount: '260.00', reservedCostAmount: '20.00', estimatedGrossProfitAmount: '-190.00', teacherFeeRuleIds: ['demo-teacher-fee-rule-li'] },
  ],
  aiActionLogs: [
    { id: 'demo-ai-log-guardian-attendance', actorUserId: 'demo-guardian-wang', actorRole: 'GUARDIAN', rawInput: '小明到托了吗？', intent: 'queryAttendance', entities: { studentId: 'demo-student-profile-wang' }, confidence: 0.94, risk: 'LOW', confirmationRequired: false, resultStatus: 'EXECUTED', resultSummary: '已返回绑定孩子到托状态和照片入口。' },
    { id: 'demo-ai-log-admin-refusal', actorUserId: 'demo-super-admin', actorRole: 'SUPER_ADMIN', rawInput: '把欠费改成 0', intent: 'queryBilling', entities: { requestedMutation: 'modifyDebtAmount' }, confidence: 0.91, risk: 'HIGH', confirmationRequired: false, resultStatus: 'REJECTED', resultSummary: '高风险收费修改已拒绝，需进入收费记录页人工复核。' },
  ],
};
