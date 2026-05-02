import { describe, expect, it } from 'vitest';

import { createPhotoCheckInUploadDraft } from '@/domain/attendance/photo-check-in';

const teacher = {
  id: 'demo-teacher-li',
  role: 'TEACHER' as const,
  teacherAssignments: [{ campusId: 'demo-campus-east', classId: 'demo-class-east-g3' }],
};

const student = {
  id: 'demo-student-profile-wang',
  campusId: 'demo-campus-east',
  classId: 'demo-class-east-g3',
};

describe('photo check-in upload service', () => {
  it('generates both private attendance photo metadata and an attendance record draft', () => {
    const draft = createPhotoCheckInUploadDraft({
      actor: teacher,
      student,
      serviceType: '晚辅导',
      checkedAt: new Date('2026-05-02T10:30:00.000Z'),
      file: {
        originalName: 'arrival.jpg',
        mimeType: 'image/jpeg',
        byteSize: 128_000,
      },
      isMatched: true,
    });

    expect(draft.file).toMatchObject({
      campusId: 'demo-campus-east',
      studentId: 'demo-student-profile-wang',
      originalName: 'arrival.jpg',
      mimeType: 'image/jpeg',
      byteSize: 128_000,
      purpose: 'ATTENDANCE_PHOTO',
      uploadedByUserId: 'demo-teacher-li',
      visibility: 'PRIVATE',
    });
    expect(draft.file.storageKey).toContain('attendance/demo-campus-east/');
    expect(draft.attendanceRecord).toMatchObject({
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-g3',
      studentId: 'demo-student-profile-wang',
      teacherUserId: 'demo-teacher-li',
      serviceType: '晚辅导',
      status: '已到',
      checkedAt: new Date('2026-05-02T10:30:00.000Z'),
      photoFileId: draft.file.storageKey,
      matchStatus: 'MATCHED',
      notificationStatus: 'PENDING',
    });
    expect(JSON.stringify(draft)).not.toContain('http://');
    expect(JSON.stringify(draft)).not.toContain('https://');
  });

  it('rejects teachers uploading arrival photos for students outside their assignment', () => {
    expect(() =>
      createPhotoCheckInUploadDraft({
        actor: teacher,
        student: {
          id: 'demo-student-profile-liu',
          campusId: 'demo-campus-west',
          classId: 'demo-class-west-g4',
        },
        serviceType: '晚辅导',
        checkedAt: new Date('2026-05-02T10:30:00.000Z'),
        file: {
          originalName: 'arrival.jpg',
          mimeType: 'image/jpeg',
          byteSize: 128_000,
        },
        isMatched: true,
      }),
    ).toThrow('老师只能为负责学生上传到托照片');
  });

  it('suppresses notification when photo match is not confirmed yet', () => {
    const draft = createPhotoCheckInUploadDraft({
      actor: teacher,
      student,
      serviceType: '晚辅导',
      checkedAt: new Date('2026-05-02T10:30:00.000Z'),
      file: {
        originalName: 'arrival.jpg',
        mimeType: 'image/jpeg',
        byteSize: 128_000,
      },
      isMatched: false,
    });

    expect(draft.attendanceRecord).toMatchObject({
      status: '已到',
      matchStatus: 'PENDING_CONFIRMATION',
      notificationStatus: 'SUPPRESSED',
    });
  });
});
