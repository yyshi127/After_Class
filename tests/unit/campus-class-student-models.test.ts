import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { assertCampusCanCreateRecords, campusSupportsServiceType } from '@/domain/campus/campus';
import { assertClassBelongsToCampus } from '@/domain/classes/classes';
import { assertValidStudentServiceType } from '@/domain/students/students';

const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');

describe('campus, class, and student foundation models', () => {
  it('defines Campus with operating fields and service type scope', () => {
    expect(schema).toContain('enum CampusStatus');
    expect(schema).toContain('model Campus');
    expect(schema).toContain('name                  String');
    expect(schema).toContain('address               String');
    expect(schema).toContain('phone                 String');
    expect(schema).toContain('principalName         String');
    expect(schema).toContain('status                CampusStatus');
    expect(schema).toContain('serviceHours          String');
    expect(schema).toContain('supportedServiceTypes ServiceType[]');
  });

  it('prevents creating students or classes under inactive campuses', () => {
    expect(() => assertCampusCanCreateRecords({ id: 'campus-1', status: 'ACTIVE' })).not.toThrow();
    expect(() => assertCampusCanCreateRecords({ id: 'campus-2', status: 'INACTIVE' })).toThrow(
      '停用校区不能新建学生或班级',
    );
  });

  it('defines Class records as campus-scoped and validates class-campus ownership', () => {
    expect(schema).toContain('model CustodyClass');
    expect(schema).toContain('campusId  String');
    expect(schema).toContain('grade     String');
    expect(schema).toContain('name      String');
    expect(schema).toContain('capacity  Int');

    expect(() => assertClassBelongsToCampus({ id: 'class-1', campusId: 'campus-1' }, 'campus-1')).not.toThrow();
    expect(() => assertClassBelongsToCampus({ id: 'class-1', campusId: 'campus-1' }, 'campus-2')).toThrow(
      '班级必须属于指定校区',
    );
  });

  it('defines Student records with campus, class, identity, status, and fixed service type', () => {
    expect(schema).toContain('model Student');
    expect(schema).toContain('identityNumber String?');
    expect(schema).toContain('school         String');
    expect(schema).toContain('grade          String');
    expect(schema).toContain('campusId       String');
    expect(schema).toContain('classId        String?');
    expect(schema).toContain('serviceType    ServiceType');
    expect(schema).toContain('status         StudentStatus');
    expect(schema).toContain('safetyNote     String?');

    expect(assertValidStudentServiceType('晚辅导')).toBe('晚辅导');
    expect(() => assertValidStudentServiceType('寒假班')).toThrow('学生必须选择四种固定托管类型之一');
  });

  it('checks whether a campus supports the selected fixed service type', () => {
    expect(campusSupportsServiceType({ supportedServiceTypes: ['中午托', '晚辅导'] }, '晚辅导')).toBe(true);
    expect(campusSupportsServiceType({ supportedServiceTypes: ['中午托', '晚辅导'] }, '晚全托')).toBe(false);
  });
});
