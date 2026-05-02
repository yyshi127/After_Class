import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';

import { buildPrivateFileMetadata, type PrivateFileMetadataDraft } from '@/domain/files/private-file';
import type { PracticeSheetDraft } from '@/domain/mistake-book/practice-sheet-draft';

export type PracticeSheetMistakeSummary = {
  mistakeBookItemId: string;
  knowledgePoint: string;
  mistakeReason: string;
  questionText: string | null;
};

export type PracticeSheetDocxTrace = {
  practiceSheetDraftId: string;
  studentId: string;
  classId: string;
  subject: string;
  sourceMistakeBookItemIds: string[];
  practiceQuestionIds: string[];
  generatedByUserId: string;
  generatedAt: string;
};

export type PracticeSheetDocxResult = {
  docxBuffer: Buffer;
  file: PrivateFileMetadataDraft;
  trace: PracticeSheetDocxTrace;
};

export async function generatePracticeSheetDocx(input: {
  campusId: string;
  generatedByUserId: string;
  generatedAt: Date;
  draft: PracticeSheetDraft;
  mistakeSummaries: readonly PracticeSheetMistakeSummary[];
  remark?: string;
}): Promise<PracticeSheetDocxResult> {
  if (!input.draft.canGenerateWord || input.draft.questions.length === 0) {
    throw new Error(input.draft.blockedReason ?? '未勾选同类题，不能生成 Word 练习单');
  }

  const generatedAtIso = input.generatedAt.toISOString();
  const generatedDate = generatedAtIso.slice(0, 10);
  const originalName = `${input.draft.studentName}-${input.draft.subject}-错题练习单-${generatedDate}.docx`;

  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: '错题同类题练习单',
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph(`学生：${input.draft.studentName}`),
          new Paragraph(`班级：${input.draft.className}`),
          new Paragraph(`学科：${input.draft.subject}`),
          new Paragraph(`生成时间：${generatedAtIso}`),
          new Paragraph({ text: '错题摘要', heading: HeadingLevel.HEADING_1 }),
          ...input.mistakeSummaries.flatMap((summary, index) => [
            new Paragraph(`${index + 1}. ${summary.knowledgePoint}`),
            new Paragraph(`原题：${summary.questionText ?? '无题干快照'}`),
            new Paragraph(`错因：${summary.mistakeReason}`),
          ]),
          new Paragraph({ text: '同类题练习', heading: HeadingLevel.HEADING_1 }),
          ...input.draft.questions.flatMap((question, index) => [
            new Paragraph({
              children: [new TextRun({ text: `${index + 1}. ${question.prompt}`, bold: true })],
            }),
            new Paragraph('答题区域：'),
            new Paragraph('________________________________________________________________'),
            new Paragraph('________________________________________________________________'),
          ]),
          new Paragraph({ text: '备注', heading: HeadingLevel.HEADING_1 }),
          new Paragraph(input.remark ?? '请完成后交由老师检查订正。'),
        ],
      },
    ],
  });

  const docxBuffer = await Packer.toBuffer(document);
  const file = buildPrivateFileMetadata({
    campusId: input.campusId,
    studentId: input.draft.studentId,
    originalName,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    byteSize: docxBuffer.byteLength,
    purpose: 'PRACTICE_DOCX',
    uploadedByUserId: input.generatedByUserId,
  });

  return {
    docxBuffer,
    file,
    trace: {
      practiceSheetDraftId: input.draft.id,
      studentId: input.draft.studentId,
      classId: input.draft.classId,
      subject: input.draft.subject,
      sourceMistakeBookItemIds: input.draft.sourceMistakeBookItemIds,
      practiceQuestionIds: input.draft.questions.map((question) => question.id),
      generatedByUserId: input.generatedByUserId,
      generatedAt: generatedAtIso,
    },
  };
}
