import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TeacherHomeworkUploadPage } from '@/components/teacher/teacher-homework-upload-page';
import {
  createTeacherHomeworkUploadDraft,
  getTeacherHomeworkUploadOptions,
  type TeacherHomeworkUploadStudent,
} from '@/domain/teacher/homework-upload';

const students: TeacherHomeworkUploadStudent[] = [
  {
    id: 'student-east-1',
    studentName: '王小明',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g3',
    className: '三年级晚辅 A 班',
  },
  {
    id: 'student-east-2',
    studentName: '李小红',
    campusId: 'campus-east',
    campusName: '东城托管中心',
    classId: 'class-east-g4',
    className: '四年级晚辅 B 班',
  },
  {
    id: 'student-west-1',
    studentName: '赵小西',
    campusId: 'campus-west',
    campusName: '西城托管中心',
    classId: 'class-west-g3',
    className: '西城三年级晚辅 A 班',
  },
];

const teacher = {
  id: 'teacher-li',
  role: 'TEACHER' as const,
  teacherAssignments: [{ campusId: 'campus-east', classId: 'class-east-g3' }],
};

describe('teacher homework upload', () => {
  it('only exposes upload options for students assigned to the teacher', () => {
    const options = getTeacherHomeworkUploadOptions({ actor: teacher, students });

    expect(options.students).toHaveLength(1);
    expect(options.students[0]).toEqual(expect.objectContaining({ id: 'student-east-1', studentName: '王小明' }));
    expect(options.classes).toEqual([{ id: 'class-east-g3', name: '三年级晚辅 A 班' }]);
  });

  it('rejects homework uploads for non-assigned students', () => {
    expect(() =>
      createTeacherHomeworkUploadDraft({
        actor: teacher,
        students,
        studentId: 'student-west-1',
        subject: '数学',
        originalName: 'homework.jpg',
        mimeType: 'image/jpeg',
        byteSize: 256_000,
      }),
    ).toThrow('老师不能给非负责学生上传作业');
  });

  it('creates private file metadata and an unpublished homework review draft for an assigned student', () => {
    const draft = createTeacherHomeworkUploadDraft({
      actor: teacher,
      students,
      studentId: 'student-east-1',
      subject: '数学',
      originalName: 'homework.jpg',
      mimeType: 'image/jpeg',
      byteSize: 256_000,
    });

    expect(draft.privateFile).toMatchObject({
      campusId: 'campus-east',
      studentId: 'student-east-1',
      originalName: 'homework.jpg',
      mimeType: 'image/jpeg',
      byteSize: 256_000,
      purpose: 'HOMEWORK_ORIGINAL',
      uploadedByUserId: 'teacher-li',
      visibility: 'PRIVATE',
    });
    expect(draft.privateFile.storageKey).toContain('homework/original/campus-east/');
    expect(draft.homeworkReview).toMatchObject({
      campusId: 'campus-east',
      classId: 'class-east-g3',
      studentId: 'student-east-1',
      teacherUserId: 'teacher-li',
      subject: '数学',
      status: 'UPLOADED',
      publishStatus: 'DRAFT',
    });
  });

  it('renders class to student selection and homework image upload controls', () => {
    render(<TeacherHomeworkUploadPage actor={teacher} students={students} />);

    expect(screen.getByRole('heading', { name: '上传作业' })).toBeInTheDocument();
    expect(screen.getByLabelText('选择班级')).toBeInTheDocument();
    expect(screen.getByLabelText('选择学生')).toBeInTheDocument();
    expect(screen.getByLabelText('作业学科')).toBeInTheDocument();
    expect(screen.getByLabelText('作业图片')).toBeInTheDocument();
    expect(screen.getByText('王小明')).toBeInTheDocument();
    expect(screen.queryByText('赵小西')).not.toBeInTheDocument();
    expect(screen.getByText('图片将存入私有文件服务，家长需授权后访问。')).toBeInTheDocument();
  });
});
