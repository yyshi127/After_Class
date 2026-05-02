import { describe, expect, it } from 'vitest';

import { maskIdentityNumber, toStudentListItem, toStudentParentProfile } from '@/domain/students/identity';

describe('student identity number masking', () => {
  it('masks Chinese identity numbers by default with first 4 and last 4 visible', () => {
    expect(maskIdentityNumber('310101201001013218')).toBe('3101********3218');
  });

  it('masks short or empty identity numbers defensively', () => {
    expect(maskIdentityNumber('12345678')).toBe('1234****5678');
    expect(maskIdentityNumber(null)).toBe(null);
  });

  it('uses masked identity numbers in student list DTOs', () => {
    expect(
      toStudentListItem({
        id: 'student-1',
        name: '王小明',
        identityNumber: '310101201001013218',
        campusId: 'campus-1',
        classId: 'class-1',
        serviceType: '晚辅导',
        status: 'ACTIVE',
      }),
    ).toMatchObject({ identityNumber: '3101********3218' });
  });

  it('uses masked identity numbers in parent-facing student profiles', () => {
    expect(
      toStudentParentProfile({
        id: 'student-1',
        name: '王小明',
        identityNumber: '310101201001013218',
        serviceType: '晚辅导',
      }),
    ).toEqual({
      id: 'student-1',
      name: '王小明',
      identityNumber: '3101********3218',
      serviceType: '晚辅导',
    });
  });
});
