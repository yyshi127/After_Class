import type { AttendanceStatus, ServiceType, TeacherAttendanceStatus } from '@/domain/shared/enums';
import { getApplicableTeacherFeeRule, type TeacherFeeRule } from '@/domain/billing/teacher-fee-rule';

export type SettlementStudent = {
  id: string;
  campusId: string;
  classId?: string | null;
  serviceType: ServiceType;
  dailyRevenue: number;
};

export type SettlementAttendanceRecord = {
  studentId: string;
  status: AttendanceStatus;
};

export type SettlementTeacherAttendance = {
  teacherUserId: string;
  campusId: string;
  classId?: string | null;
  status: TeacherAttendanceStatus;
};

export type CalculateClassSettlementInput = {
  campusId: string;
  classId: string;
  serviceType: ServiceType;
  settlementDate: Date;
  students: readonly SettlementStudent[];
  attendanceRecords: readonly SettlementAttendanceRecord[];
  teacherAttendances: readonly SettlementTeacherAttendance[];
  teacherFeeRules: readonly TeacherFeeRule[];
  reservedCostAmount: number;
};

export type ClassSettlementDraft = {
  campusId: string;
  classId: string;
  serviceType: ServiceType;
  settlementDate: Date;
  expectedCount: number;
  arrivedCount: number;
  leaveCount: number;
  absentCount: number;
  studentRevenueAmount: number;
  teacherFeeAmount: number;
  reservedCostAmount: number;
  estimatedGrossProfitAmount: number;
  teacherFeeRuleIds: string[];
};

const REVENUE_ATTENDANCE_STATUSES: readonly AttendanceStatus[] = ['已到', '迟到', '已离托'];

export function calculateClassSettlementDraft(input: CalculateClassSettlementInput): ClassSettlementDraft {
  const scopedStudents = input.students.filter(
    (student) =>
      student.campusId === input.campusId &&
      student.classId === input.classId &&
      student.serviceType === input.serviceType,
  );
  const scopedStudentIds = new Set(scopedStudents.map((student) => student.id));
  const attendanceByStudent = new Map(
    input.attendanceRecords
      .filter((record) => scopedStudentIds.has(record.studentId))
      .map((record) => [record.studentId, record.status]),
  );

  const arrivedCount = scopedStudents.filter((student) =>
    REVENUE_ATTENDANCE_STATUSES.includes(attendanceByStudent.get(student.id) ?? '待确认'),
  ).length;
  const leaveCount = scopedStudents.filter((student) => attendanceByStudent.get(student.id) === '请假').length;
  const absentCount = scopedStudents.filter((student) => attendanceByStudent.get(student.id) === '缺勤').length;
  const studentRevenueAmount = scopedStudents
    .filter((student) => REVENUE_ATTENDANCE_STATUSES.includes(attendanceByStudent.get(student.id) ?? '待确认'))
    .reduce((total, student) => total + student.dailyRevenue, 0);

  const teacherFeeRuleIds: string[] = [];
  const teacherFeeAmount = input.teacherAttendances
    .filter(
      (attendance) =>
        attendance.campusId === input.campusId &&
        attendance.classId === input.classId &&
        (attendance.status === '已签到' || attendance.status === '已签退' || attendance.status === '补签'),
    )
    .reduce((total, attendance) => {
      const feeRule = getApplicableTeacherFeeRule({
        rules: input.teacherFeeRules,
        campusId: input.campusId,
        classId: input.classId,
        teacherUserId: attendance.teacherUserId,
        serviceType: input.serviceType,
        settlementDate: input.settlementDate,
      });

      if (!feeRule) {
        return total;
      }

      teacherFeeRuleIds.push(feeRule.ruleId);
      return total + feeRule.feeAmount;
    }, 0);

  return {
    campusId: input.campusId,
    classId: input.classId,
    serviceType: input.serviceType,
    settlementDate: input.settlementDate,
    expectedCount: scopedStudents.length,
    arrivedCount,
    leaveCount,
    absentCount,
    studentRevenueAmount,
    teacherFeeAmount,
    reservedCostAmount: input.reservedCostAmount,
    estimatedGrossProfitAmount: studentRevenueAmount - teacherFeeAmount - input.reservedCostAmount,
    teacherFeeRuleIds,
  };
}
