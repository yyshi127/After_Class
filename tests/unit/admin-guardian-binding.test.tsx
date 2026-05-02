import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminGuardianBinding } from '@/components/admin/admin-guardian-binding';
import { canGuardianAccessBoundStudent, validateGuardianBindingInput } from '@/domain/admin/guardian-binding';

const students = [
  { id: 'student-east', name: '王小明', campusId: 'campus-east' },
  { id: 'student-west', name: '李小红', campusId: 'campus-west' },
];

describe('admin guardian binding management', () => {
  it('validates guardian name, phone, relationship, student and notification switch', () => {
    const result = validateGuardianBindingInput({
      guardianName: '',
      phone: '',
      relationship: '',
      studentId: '',
      notifyEnabled: true,
    }, students);

    expect(result.success).toBe(false);
    expect(result.errors).toEqual(
      expect.objectContaining({
        guardianName: '家长姓名必填',
        phone: '手机号必填',
        relationship: '与学生关系必填',
        studentId: '绑定学生必选',
      }),
    );
  });

  it('rejects binding to an unavailable student', () => {
    const result = validateGuardianBindingInput({
      guardianName: '王女士',
      phone: '13800000004',
      relationship: '母亲',
      studentId: 'student-missing',
      notifyEnabled: false,
    }, students);

    expect(result.success).toBe(false);
    expect(result.errors.studentId).toBe('绑定学生不存在或无权绑定');
  });

  it('keeps guardian access limited to bound children after binding', () => {
    const guardian = { guardianStudentIds: ['student-east'] };

    expect(canGuardianAccessBoundStudent(guardian, 'student-east')).toBe(true);
    expect(canGuardianAccessBoundStudent(guardian, 'student-west')).toBe(false);
  });

  it('renders guardian binding fields and notification switch', () => {
    render(
      <AdminGuardianBinding
        students={students}
        bindings={[{ id: 'binding-1', guardianName: '王女士', phone: '13800000004', relationship: '母亲', studentId: 'student-east', studentName: '王小明', notifyEnabled: true }]}
      />,
    );

    expect(screen.getByRole('heading', { name: '家长绑定管理' })).toBeInTheDocument();
    expect(screen.getByLabelText('家长姓名')).toBeInTheDocument();
    expect(screen.getByLabelText('手机号')).toBeInTheDocument();
    expect(screen.getByLabelText('与学生关系')).toBeInTheDocument();
    expect(screen.getByLabelText('绑定学生')).toBeInTheDocument();
    expect(screen.getByLabelText('开启到托和作业通知')).toBeChecked();
    expect(screen.getByText('王女士')).toBeInTheDocument();
    expect(screen.getAllByText('王小明')).toHaveLength(2);
  });
});
