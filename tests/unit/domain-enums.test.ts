import { describe, expect, it } from 'vitest';
import {
  AI_INTENTS,
  ATTENDANCE_STATUSES,
  BILLING_CYCLES,
  RISK_LEVELS,
  ROLES,
  SERVICE_TYPES,
  STUDENT_STATUSES,
  TEACHER_ATTENDANCE_STATUSES,
  isServiceType,
} from '@/domain/shared/enums';

describe('afterclass fixed domain enums', () => {
  it('contains exactly the four MVP service types and rejects custom service types', () => {
    expect(SERVICE_TYPES).toEqual(['中午托', '下午托', '晚辅导', '晚全托']);
    expect(isServiceType('晚辅导')).toBe(true);
    expect(isServiceType('寒假班')).toBe(false);
  });

  it('contains required role values for the four product terminals and administrators', () => {
    expect(ROLES).toEqual([
      'SUPER_ADMIN',
      'CAMPUS_ADMIN',
      'ADMIN',
      'TEACHER',
      'ASSISTANT',
      'GUARDIAN',
      'STUDENT',
    ]);
  });

  it('contains MVP attendance, billing, risk, and AI intent values', () => {
    expect(STUDENT_STATUSES).toEqual(['ACTIVE', 'PAUSED', 'LEFT']);
    expect(ATTENDANCE_STATUSES).toEqual(['已到', '请假', '缺勤', '迟到', '已离托', '待确认']);
    expect(TEACHER_ATTENDANCE_STATUSES).toEqual(['已签到', '已签退', '迟到', '早退', '请假', '缺勤', '补签']);
    expect(BILLING_CYCLES).toEqual(['MONTHLY', 'PACKAGE', 'DAILY']);
    expect(RISK_LEVELS).toEqual(['LOW', 'MEDIUM', 'HIGH']);
    expect(AI_INTENTS).toEqual([
      'queryAttendance',
      'queryHomework',
      'createLeaveRequest',
      'queryBilling',
      'sendTeacherMessage',
      'recordHomeworkFeedback',
      'suggestMistakeAreas',
      'generateSimilarQuestions',
      'queryClassSettlement',
    ]);
  });
});
