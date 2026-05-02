import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  buildPrivateFileMetadata,
  canReadPrivateFile,
  createAuthorizedFileReadDraft,
} from '@/domain/files/private-file';

const photoFile = {
  id: 'file-arrival-photo-wang',
  campusId: 'demo-campus-east',
  studentId: 'demo-student-profile-wang',
  storageKey: 'attendance/demo-campus-east/file-arrival-photo-wang.jpg',
  visibility: 'PRIVATE' as const,
};

describe('private file storage service', () => {
  it('defines file metadata fields for private attendance photos', () => {
    const schema = readFileSync('prisma/schema.prisma', 'utf8');

    expect(schema).toContain('enum FileVisibility');
    expect(schema).toContain('model PrivateFile');
    expect(schema).toMatch(/campusId\s+String/);
    expect(schema).toMatch(/studentId\s+String\?/);
    expect(schema).toMatch(/storageKey\s+String/);
    expect(schema).toMatch(/mimeType\s+String/);
    expect(schema).toMatch(/byteSize\s+Int/);
    expect(schema).toMatch(/visibility\s+FileVisibility/);
  });

  it('builds private metadata without public URLs', () => {
    const metadata = buildPrivateFileMetadata({
      campusId: 'demo-campus-east',
      studentId: 'demo-student-profile-wang',
      originalName: 'arrival.jpg',
      mimeType: 'image/jpeg',
      byteSize: 128_000,
      purpose: 'ATTENDANCE_PHOTO',
      uploadedByUserId: 'demo-teacher-li',
    });

    expect(metadata).toMatchObject({
      campusId: 'demo-campus-east',
      studentId: 'demo-student-profile-wang',
      originalName: 'arrival.jpg',
      mimeType: 'image/jpeg',
      byteSize: 128_000,
      purpose: 'ATTENDANCE_PHOTO',
      visibility: 'PRIVATE',
      uploadedByUserId: 'demo-teacher-li',
    });
    expect(metadata.storageKey).toContain('attendance/demo-campus-east/');
    expect(JSON.stringify(metadata)).not.toContain('/public/');
    expect(JSON.stringify(metadata)).not.toContain('http://');
    expect(JSON.stringify(metadata)).not.toContain('https://');
  });

  it('allows bound guardians to read only their child files', () => {
    const boundGuardian = {
      id: 'demo-guardian-wang',
      role: 'GUARDIAN' as const,
      guardianStudentIds: ['demo-student-profile-wang'],
    };
    const otherGuardian = {
      id: 'demo-guardian-liu',
      role: 'GUARDIAN' as const,
      guardianStudentIds: ['demo-student-profile-liu'],
    };

    expect(canReadPrivateFile(boundGuardian, photoFile)).toBe(true);
    expect(canReadPrivateFile(otherGuardian, photoFile)).toBe(false);
  });

  it('creates authorized read drafts and rejects unauthorized parents', () => {
    const boundGuardian = {
      id: 'demo-guardian-wang',
      role: 'GUARDIAN' as const,
      guardianStudentIds: ['demo-student-profile-wang'],
    };
    const otherGuardian = {
      id: 'demo-guardian-liu',
      role: 'GUARDIAN' as const,
      guardianStudentIds: ['demo-student-profile-liu'],
    };

    expect(createAuthorizedFileReadDraft(boundGuardian, photoFile)).toMatchObject({
      fileId: 'file-arrival-photo-wang',
      storageKey: 'attendance/demo-campus-east/file-arrival-photo-wang.jpg',
      disposition: 'inline',
    });
    expect(() => createAuthorizedFileReadDraft(otherGuardian, photoFile)).toThrow('无权读取该文件');
  });
});
