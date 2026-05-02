import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { createArrivalNoticeDrafts } from '@/domain/notices/arrival-notice';

const attendanceRecord = {
  id: 'attendance-arrival-wang',
  campusId: 'demo-campus-east',
  studentId: 'demo-student-profile-wang',
  serviceType: '晚辅导' as const,
  checkedAt: new Date('2026-05-02T10:30:00.000Z'),
  photoFileId: 'file-arrival-photo-wang',
};

const guardians = [
  {
    guardianUserId: 'demo-guardian-wang-mother',
    studentId: 'demo-student-profile-wang',
    relationship: '妈妈',
    notifyEnabled: true,
  },
  {
    guardianUserId: 'demo-guardian-wang-father',
    studentId: 'demo-student-profile-wang',
    relationship: '爸爸',
    notifyEnabled: false,
  },
];

describe('arrival notice service', () => {
  it('defines in-app notification model with attendance and photo thumbnail references', () => {
    const schema = readFileSync('prisma/schema.prisma', 'utf8');

    expect(schema).toContain('enum NoticePushStatus');
    expect(schema).toContain('model ParentNotice');
    expect(schema).toContain('attendanceRecordId String?');
    expect(schema).toContain('photoFileId        String?');
    expect(schema).toContain('guardianUserId     String');
    expect(schema).toContain('pushStatus         NoticePushStatus');
  });

  it('creates arrival notice drafts for enabled guardians with pending push', () => {
    const drafts = createArrivalNoticeDrafts({
      attendanceRecord,
      studentName: '王小明',
      guardians,
    });

    expect(drafts).toHaveLength(2);
    expect(drafts[0]).toMatchObject({
      campusId: 'demo-campus-east',
      guardianUserId: 'demo-guardian-wang-mother',
      studentId: 'demo-student-profile-wang',
      attendanceRecordId: 'attendance-arrival-wang',
      photoFileId: 'file-arrival-photo-wang',
      type: 'ARRIVAL',
      pushStatus: 'PENDING',
      title: '王小明到托通知',
    });
    expect(drafts[0].message).toContain('已到托管中心');
  });

  it('records arrival notices but suppresses push when guardian notification is disabled', () => {
    const drafts = createArrivalNoticeDrafts({
      attendanceRecord,
      studentName: '王小明',
      guardians,
    });

    expect(drafts[1]).toMatchObject({
      guardianUserId: 'demo-guardian-wang-father',
      pushStatus: 'SUPPRESSED',
    });
    expect(drafts[1].message).toContain('已到托管中心');
  });
});
