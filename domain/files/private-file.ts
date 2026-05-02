import { randomUUID } from 'node:crypto';

import { canAccessCampus, canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';

export type FileVisibility = 'PRIVATE';
export type PrivateFilePurpose = 'ATTENDANCE_PHOTO' | 'HOMEWORK_ORIGINAL' | 'HOMEWORK_MARKED' | 'PRACTICE_DOCX';

export type PrivateFileMetadataInput = {
  campusId: string;
  studentId?: string | null;
  originalName: string;
  mimeType: string;
  byteSize: number;
  purpose: PrivateFilePurpose;
  uploadedByUserId: string;
};

export type PrivateFileMetadataDraft = PrivateFileMetadataInput & {
  studentId: string | null;
  storageKey: string;
  visibility: FileVisibility;
};

export type PrivateFileResource = {
  id: string;
  campusId: string;
  studentId?: string | null;
  storageKey: string;
  visibility: FileVisibility;
};

export type AuthorizedFileReadDraft = {
  fileId: string;
  storageKey: string;
  disposition: 'inline';
};

const STORAGE_PREFIX_BY_PURPOSE: Record<PrivateFilePurpose, string> = {
  ATTENDANCE_PHOTO: 'attendance',
  HOMEWORK_ORIGINAL: 'homework/original',
  HOMEWORK_MARKED: 'homework/marked',
  PRACTICE_DOCX: 'practice-docx',
};

export function buildPrivateFileMetadata(input: PrivateFileMetadataInput): PrivateFileMetadataDraft {
  return {
    ...input,
    studentId: input.studentId ?? null,
    storageKey: `${STORAGE_PREFIX_BY_PURPOSE[input.purpose]}/${input.campusId}/${randomUUID()}-${input.originalName}`,
    visibility: 'PRIVATE',
  };
}

export function canReadPrivateFile(actor: PermissionActor, file: PrivateFileResource): boolean {
  if (file.visibility !== 'PRIVATE') {
    return false;
  }

  if (file.studentId) {
    return canAccessStudent(actor, {
      id: file.studentId,
      campusId: file.campusId,
    });
  }

  return canAccessCampus(actor, file.campusId);
}

export function createAuthorizedFileReadDraft(
  actor: PermissionActor,
  file: PrivateFileResource,
): AuthorizedFileReadDraft {
  if (!canReadPrivateFile(actor, file)) {
    throw new Error('无权读取该文件');
  }

  return {
    fileId: file.id,
    storageKey: file.storageKey,
    disposition: 'inline',
  };
}
