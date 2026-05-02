export const ROLES = [
  'SUPER_ADMIN',
  'CAMPUS_ADMIN',
  'ADMIN',
  'TEACHER',
  'ASSISTANT',
  'GUARDIAN',
  'STUDENT',
] as const;

export type Role = (typeof ROLES)[number];

export const SERVICE_TYPES = ['中午托', '下午托', '晚辅导', '晚全托'] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export function isServiceType(value: string): value is ServiceType {
  return (SERVICE_TYPES as readonly string[]).includes(value);
}

export const STUDENT_STATUSES = ['ACTIVE', 'PAUSED', 'LEFT'] as const;

export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export const ATTENDANCE_STATUSES = ['已到', '请假', '缺勤', '迟到', '已离托', '待确认'] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const TEACHER_ATTENDANCE_STATUSES = ['已签到', '已签退', '迟到', '早退', '请假', '缺勤', '补签'] as const;

export type TeacherAttendanceStatus = (typeof TEACHER_ATTENDANCE_STATUSES)[number];

export const BILLING_CYCLES = ['MONTHLY', 'PACKAGE', 'DAILY'] as const;

export type BillingCycle = (typeof BILLING_CYCLES)[number];

export const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];

export const AI_INTENTS = [
  'queryAttendance',
  'queryHomework',
  'createLeaveRequest',
  'queryBilling',
  'sendTeacherMessage',
  'recordHomeworkFeedback',
  'suggestMistakeAreas',
  'generateSimilarQuestions',
  'queryClassSettlement',
] as const;

export type AiIntent = (typeof AI_INTENTS)[number];
