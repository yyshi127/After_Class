import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminCampusForm } from '@/components/admin/admin-campus-form';
import { validateCampusFormInput } from '@/domain/admin/campus-form';

describe('admin campus form', () => {
  it('validates required campus fields and at least one service type', () => {
    const result = validateCampusFormInput({
      name: '',
      address: '',
      phone: '',
      principalName: '',
      serviceHours: '',
      status: 'ACTIVE',
      supportedServiceTypes: [],
    });

    expect(result.success).toBe(false);
    expect(result.errors).toEqual(
      expect.objectContaining({
        name: '校区名称必填',
        address: '校区地址必填',
        phone: '联系电话必填',
        principalName: '负责人必填',
        serviceHours: '服务时段必填',
        supportedServiceTypes: '至少选择一种服务类型',
      }),
    );
  });

  it('rejects unsupported service types instead of allowing custom custody types', () => {
    const result = validateCampusFormInput({
      name: '东城托管中心',
      address: '东城区育才路 18 号',
      phone: '010-10000001',
      principalName: '陈校长',
      serviceHours: '周一至周五 11:30-21:00',
      status: 'ACTIVE',
      supportedServiceTypes: ['晚辅导', '周末托管'],
    });

    expect(result.success).toBe(false);
    expect(result.errors.supportedServiceTypes).toBe('服务类型必须是四种固定托管类型之一');
  });

  it('flags inactive campus business restriction for student and class creation', () => {
    const result = validateCampusFormInput({
      name: '西城托管中心',
      address: '西城区成长路 9 号',
      phone: '010-10000002',
      principalName: '赵校长',
      serviceHours: '周一至周五 13:30-21:00',
      status: 'INACTIVE',
      supportedServiceTypes: ['晚辅导'],
    });

    expect(result.success).toBe(true);
    expect(result.data?.canCreateStudentOrClass).toBe(false);
    expect(result.data?.businessRestriction).toBe('停用校区不能新建学生或班级');
  });

  it('renders new/edit fields, fixed service type checkboxes, and inactive warning', () => {
    render(
      <AdminCampusForm
        mode="edit"
        initialValue={{
          name: '西城托管中心',
          address: '西城区成长路 9 号',
          phone: '010-10000002',
          principalName: '赵校长',
          serviceHours: '周一至周五 13:30-21:00',
          status: 'INACTIVE',
          supportedServiceTypes: ['下午托', '晚辅导'],
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: '编辑校区' })).toBeInTheDocument();
    expect(screen.getByLabelText('校区名称')).toHaveValue('西城托管中心');
    expect(screen.getByLabelText('校区地址')).toHaveValue('西城区成长路 9 号');
    expect(screen.getByLabelText('联系电话')).toHaveValue('010-10000002');
    expect(screen.getByLabelText('负责人')).toHaveValue('赵校长');
    expect(screen.getByLabelText('服务时段')).toHaveValue('周一至周五 13:30-21:00');
    expect(screen.getByLabelText('下午托')).toBeChecked();
    expect(screen.getByLabelText('晚辅导')).toBeChecked();
    expect(screen.getByText('停用校区不能新建学生或班级')).toBeInTheDocument();
  });
});
