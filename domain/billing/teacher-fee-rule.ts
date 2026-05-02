import type { ServiceType } from '@/domain/shared/enums';

export type TeacherFeeBillingMode = 'CLASS_FIXED' | 'DAILY_FIXED';

export type TeacherFeeRule = {
  id: string;
  campusId: string;
  classId?: string | null;
  teacherUserId: string;
  serviceType: ServiceType;
  billingMode: TeacherFeeBillingMode;
  feeAmount: number;
  effectiveFrom: Date;
  effectiveTo?: Date | null;
  isActive: boolean;
};

export type TeacherFeeRuleQuery = {
  rules: readonly TeacherFeeRule[];
  campusId: string;
  classId?: string | null;
  teacherUserId: string;
  serviceType: ServiceType;
  settlementDate: Date;
};

export type ApplicableTeacherFeeRule = {
  ruleId: string;
  billingMode: TeacherFeeBillingMode;
  feeAmount: number;
};

export function getApplicableTeacherFeeRule({
  rules,
  campusId,
  classId,
  teacherUserId,
  serviceType,
  settlementDate,
}: TeacherFeeRuleQuery): ApplicableTeacherFeeRule | null {
  const matchedRules = rules
    .filter(
      (rule) =>
        rule.isActive &&
        rule.campusId === campusId &&
        rule.teacherUserId === teacherUserId &&
        rule.serviceType === serviceType &&
        (rule.classId == null || rule.classId === classId) &&
        rule.effectiveFrom <= settlementDate &&
        (rule.effectiveTo == null || rule.effectiveTo >= settlementDate),
    )
    .sort((a, b) => {
      if (a.classId === classId && b.classId !== classId) {
        return -1;
      }

      if (a.classId !== classId && b.classId === classId) {
        return 1;
      }

      return b.effectiveFrom.getTime() - a.effectiveFrom.getTime();
    });

  const rule = matchedRules[0];

  if (!rule) {
    return null;
  }

  return {
    ruleId: rule.id,
    billingMode: rule.billingMode,
    feeAmount: rule.feeAmount,
  };
}
