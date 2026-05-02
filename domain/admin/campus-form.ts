import { assertCampusCanCreateRecords } from '@/domain/campus/campus';
import { isServiceType, type ServiceType } from '@/domain/shared/enums';

export type CampusFormStatus = 'ACTIVE' | 'INACTIVE';

export type CampusFormInput = {
  name: string;
  address: string;
  phone: string;
  principalName: string;
  serviceHours: string;
  status: CampusFormStatus;
  supportedServiceTypes: readonly string[];
};

export type CampusFormData = Omit<CampusFormInput, 'supportedServiceTypes'> & {
  supportedServiceTypes: readonly ServiceType[];
  canCreateStudentOrClass: boolean;
  businessRestriction: string | null;
};

export type CampusFormErrors = Partial<Record<keyof CampusFormInput, string>>;

export type CampusFormValidationResult =
  | { success: true; data: CampusFormData; errors: CampusFormErrors }
  | { success: false; data: null; errors: CampusFormErrors };

export function validateCampusFormInput(input: CampusFormInput): CampusFormValidationResult {
  const errors: CampusFormErrors = {};
  const name = input.name.trim();
  const address = input.address.trim();
  const phone = input.phone.trim();
  const principalName = input.principalName.trim();
  const serviceHours = input.serviceHours.trim();

  if (name.length === 0) errors.name = '校区名称必填';
  if (address.length === 0) errors.address = '校区地址必填';
  if (phone.length === 0) errors.phone = '联系电话必填';
  if (principalName.length === 0) errors.principalName = '负责人必填';
  if (serviceHours.length === 0) errors.serviceHours = '服务时段必填';
  if (input.supportedServiceTypes.length === 0) {
    errors.supportedServiceTypes = '至少选择一种服务类型';
  } else if (!input.supportedServiceTypes.every(isServiceType)) {
    errors.supportedServiceTypes = '服务类型必须是四种固定托管类型之一';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, data: null, errors };
  }

  let businessRestriction: string | null = null;
  try {
    assertCampusCanCreateRecords({ id: 'form-campus', status: input.status });
  } catch (error) {
    businessRestriction = error instanceof Error ? error.message : '停用校区不能新建学生或班级';
  }

  return {
    success: true,
    data: {
      name,
      address,
      phone,
      principalName,
      serviceHours,
      status: input.status,
      supportedServiceTypes: input.supportedServiceTypes as readonly ServiceType[],
      canCreateStudentOrClass: businessRestriction === null,
      businessRestriction,
    },
    errors: {},
  };
}
