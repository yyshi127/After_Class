import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminStudentForm } from '@/components/admin/admin-student-form';
import { validateStudentFormInput } from '@/domain/admin/student-form';

const campuses = [
  {
    id: 'campus-east',
    name: '东城托管中心',
    status: 'ACTIVE' as const,
    supportedServiceTypes: ['中午托', '下午托', '晚辅导', '晚全托'] as const,
  },
  {
    id: 'campus-west',
    name: '西城托管中心',
    status: 'INACTIVE' as const,
    supportedServiceTypes: ['晚辅导'] as const,
  },
];

const classes = [
  { id: 'class-east-g3', campusId: 'campus-east', name: '三年级晚辅 A 班' },
  { id: 'class-west-g4', campusId: 'campus-west', name: '四年级晚托 B 班' },
];

describe('admin student form', () => {
  it('validates required fields and rejects saving without custody type', () => {
    const result = validateStudentFormInput({
      name: '',
      identityNumber: '',
      school: '',
      grade: '',
      campusId: '',
      classId: '',
      serviceType: '',
      status: 'ACTIVE',
      safetyNote: '',
    }, campuses, classes);

    expect(result.success).toBe(false);
    expect(result.errors).toEqual(
      expect.objectContaining({
        name: '学生姓名必填',
        school: '就读学校必填',
        grade: '年级必填',
        campusId: '校区必选',
        classId: '班级必选',
        serviceType: '托管类型必选',
      }),
    );
  });

  it('rejects unsupported custody type and inactive campus', () => {
    const unsupported = validateStudentFormInput({
      name: '王小明',
      identityNumber: '310101201001013218',
      school: '育才小学',
      grade: '三年级',
      campusId: 'campus-east',
      classId: 'class-east-g3',
      serviceType: '周末托管',
      status: 'ACTIVE',
      safetyNote: '',
    }, campuses, classes);

    expect(unsupported.success).toBe(false);
    expect(unsupported.errors.serviceType).toBe('托管类型必须是四种固定托管类型之一');

    const inactiveCampus = validateStudentFormInput({
      name: '李小红',
      identityNumber: '',
      school: '成长小学',
      grade: '四年级',
      campusId: 'campus-west',
      classId: 'class-west-g4',
      serviceType: '晚辅导',
      status: 'ACTIVE',
      safetyNote: '',
    }, campuses, classes);

    expect(inactiveCampus.success).toBe(false);
    expect(inactiveCampus.errors.campusId).toBe('停用校区不能新建学生或班级');
  });

  it('rejects class from a different campus', () => {
    const result = validateStudentFormInput({
      name: '王小明',
      identityNumber: '',
      school: '育才小学',
      grade: '三年级',
      campusId: 'campus-east',
      classId: 'class-west-g4',
      serviceType: '晚辅导',
      status: 'ACTIVE',
      safetyNote: '',
    }, campuses, classes);

    expect(result.success).toBe(false);
    expect(result.errors.classId).toBe('班级必须属于所选校区');
  });

  it('renders student base fields, campus/class selectors, fixed custody types, and safety note', () => {
    render(
      <AdminStudentForm
        mode="edit"
        campuses={campuses}
        classes={classes}
        initialValue={{
          name: '王小明',
          identityNumber: '310101201001013218',
          school: '育才小学',
          grade: '三年级',
          campusId: 'campus-east',
          classId: 'class-east-g3',
          serviceType: '晚辅导',
          status: 'ACTIVE',
          safetyNote: '放学后需家长本人接送。',
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: '编辑学生' })).toBeInTheDocument();
    expect(screen.getByLabelText('学生姓名')).toHaveValue('王小明');
    expect(screen.getByLabelText('身份证号')).toHaveValue('310101201001013218');
    expect(screen.getByLabelText('就读学校')).toHaveValue('育才小学');
    expect(screen.getByLabelText('年级')).toHaveValue('三年级');
    expect(screen.getByLabelText('校区')).toHaveValue('campus-east');
    expect(screen.getByLabelText('班级')).toHaveValue('class-east-g3');
    expect(screen.getByLabelText('晚辅导')).toBeChecked();
    expect(screen.getByLabelText('安全备注')).toHaveValue('放学后需家长本人接送。');
  });
});
