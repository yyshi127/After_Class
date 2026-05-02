import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import { buildPrivateFileMetadata, type PrivateFileMetadataDraft } from '@/domain/files/private-file';
import { createHomeworkReviewDraft, type HomeworkReviewDraft } from '@/domain/homework/homework-review';

export type TeacherHomeworkUploadStudent = {
  id: string;
  studentName: string;
  campusId: string;
  campusName: string;
  classId: string;
  className: string;
};

export type TeacherHomeworkUploadOptions = {
  classes: Array<{ id: string; name: string }>;
  students: TeacherHomeworkUploadStudent[];
};

export type TeacherHomeworkUploadDraftInput = {
  actor: PermissionActor;
  students: readonly TeacherHomeworkUploadStudent[];
  studentId: string;
  subject: string;
  originalName: string;
  mimeType: string;
  byteSize: number;
};

export type TeacherHomeworkUploadDraft = {
  privateFile: PrivateFileMetadataDraft;
  homeworkReview: HomeworkReviewDraft;
};

export function getTeacherHomeworkUploadOptions({
  actor,
  students,
}: {
  actor: PermissionActor;
  students: readonly TeacherHomeworkUploadStudent[];
}): TeacherHomeworkUploadOptions {
  const allowedStudents = students.filter((student) =>
    canAccessStudent(actor, { id: student.id, campusId: student.campusId, classId: student.classId }),
  );

  return {
    classes: uniqueBy(allowedStudents, (student) => student.classId).map((student) => ({
      id: student.classId,
      name: student.className,
    })),
    students: allowedStudents,
  };
}

export function createTeacherHomeworkUploadDraft(input: TeacherHomeworkUploadDraftInput): TeacherHomeworkUploadDraft {
  const student = input.students.find((item) => item.id === input.studentId);

  if (!student || !canAccessStudent(input.actor, { id: student.id, campusId: student.campusId, classId: student.classId })) {
    throw new Error('老师不能给非负责学生上传作业');
  }

  const privateFile = buildPrivateFileMetadata({
    campusId: student.campusId,
    studentId: student.id,
    originalName: input.originalName,
    mimeType: input.mimeType,
    byteSize: input.byteSize,
    purpose: 'HOMEWORK_ORIGINAL',
    uploadedByUserId: input.actor.id,
  });

  return {
    privateFile,
    homeworkReview: createHomeworkReviewDraft({
      campusId: student.campusId,
      classId: student.classId,
      studentId: student.id,
      teacherUserId: input.actor.id,
      originalImageFileId: privateFile.storageKey,
      subject: input.subject,
    }),
  };
}

function uniqueBy<T>(items: readonly T[], getKey: (item: T) => string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const key = getKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}
