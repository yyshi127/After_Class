import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { createTeacherAttendanceDraft, createTeacherCheckInDraft, createTeacherCheckOutDraft } from '@/domain/attendance/teacher-attendance';

describe('TeacherAttendance model and service', () => {
  it('defines teacher attendance fields for check-in, check-out, leave, and makeup records', () => {
    const schema = readFileSync('prisma/schema.prisma', 'utf8');

    expect(schema).toContain('enum TeacherAttendanceStatus');
    expect(schema).toContain('model TeacherAttendance');
    expect(schema).toContain('teacherUserId String');
    expect(schema).toContain('campusId      String');
    expect(schema).toContain('classId       String?');
    expect(schema).toMatch(/status\s+TeacherAttendanceStatus/);
    expect(schema).toMatch(/checkedInAt\s+DateTime\?/);
    expect(schema).toMatch(/checkedOutAt\s+DateTime\?/);
    expect(schema).toMatch(/makeupByUserId\s+String\?/);
  });

  it('allows teachers to create only their own check-in draft', () => {
    const draft = createTeacherAttendanceDraft({
      actor: { id: 'demo-teacher-li', role: 'TEACHER' },
      teacherUserId: 'demo-teacher-li',
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-g3',
      checkedInAt: new Date('2026-05-02T10:00:00.000Z'),
    });

    expect(draft).toMatchObject({
      teacherUserId: 'demo-teacher-li',
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-g3',
      status: '已签到',
      makeupByUserId: null,
    });
  });

  it('rejects teachers checking in for another teacher and allows admin makeup', () => {
    expect(() =>
      createTeacherAttendanceDraft({
        actor: { id: 'demo-teacher-li', role: 'TEACHER' },
        teacherUserId: 'demo-teacher-other',
        campusId: 'demo-campus-east',
      }),
    ).toThrow('老师只能给自己签到');

    const makeup = createTeacherAttendanceDraft({
      actor: { id: 'demo-campus-admin-east', role: 'CAMPUS_ADMIN' },
      teacherUserId: 'demo-teacher-li',
      campusId: 'demo-campus-east',
      checkedInAt: new Date('2026-05-02T10:00:00.000Z'),
      makeupReason: '忘记签到，管理员补签',
    });

    expect(makeup.makeupByUserId).toBe('demo-campus-admin-east');
    expect(makeup.makeupReason).toBe('忘记签到，管理员补签');
  });

  it('prevents duplicate teacher check-in for the same day', () => {
    expect(() =>
      createTeacherCheckInDraft({
        actor: { id: 'demo-teacher-li', role: 'TEACHER' },
        teacherUserId: 'demo-teacher-li',
        campusId: 'demo-campus-east',
        classId: 'demo-class-east-g3',
        checkedInAt: new Date('2026-05-02T10:00:00.000Z'),
        existingTodayRecord: { checkedInAt: new Date('2026-05-02T09:55:00.000Z'), checkedOutAt: null },
      }),
    ).toThrow('今日已签到，不能重复签到');
  });

  it('requires a check-in record before teacher check-out', () => {
    expect(() =>
      createTeacherCheckOutDraft({
        actor: { id: 'demo-teacher-li', role: 'TEACHER' },
        teacherUserId: 'demo-teacher-li',
        campusId: 'demo-campus-east',
        classId: 'demo-class-east-g3',
        checkedOutAt: new Date('2026-05-02T19:00:00.000Z'),
        existingTodayRecord: null,
      }),
    ).toThrow('签退前必须先签到');

    const draft = createTeacherCheckOutDraft({
      actor: { id: 'demo-teacher-li', role: 'TEACHER' },
      teacherUserId: 'demo-teacher-li',
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-g3',
      checkedOutAt: new Date('2026-05-02T19:00:00.000Z'),
      existingTodayRecord: { checkedInAt: new Date('2026-05-02T10:00:00.000Z'), checkedOutAt: null },
    });

    expect(draft.status).toBe('已签退');
    expect(draft.checkedInAt).toEqual(new Date('2026-05-02T10:00:00.000Z'));
    expect(draft.checkedOutAt).toEqual(new Date('2026-05-02T19:00:00.000Z'));
  });
});
