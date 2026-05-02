import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TeacherHomeworkCorrectionCanvas } from '@/components/teacher/teacher-homework-correction-canvas';
import { createHomeworkCorrectionAreaDraft } from '@/domain/homework/correction-canvas';

describe('homework original image and correction canvas', () => {
  it('stores correction area coordinates using the original image ratio', () => {
    const area = createHomeworkCorrectionAreaDraft({
      id: 'area-1',
      imageNaturalWidth: 1200,
      imageNaturalHeight: 1600,
      displayedWidth: 300,
      displayedHeight: 400,
      displayedBox: { x: 30, y: 80, width: 90, height: 120 },
      mistakeType: '计算错误',
      note: '竖式进位漏写',
    });

    expect(area).toEqual({
      id: 'area-1',
      originalBox: { x: 120, y: 320, width: 360, height: 480 },
      imageNaturalWidth: 1200,
      imageNaturalHeight: 1600,
      mistakeType: '计算错误',
      note: '竖式进位漏写',
      status: 'DRAFT',
    });
  });

  it('rejects areas when the displayed image ratio does not match the original image', () => {
    expect(() =>
      createHomeworkCorrectionAreaDraft({
        id: 'area-ratio-mismatch',
        imageNaturalWidth: 1200,
        imageNaturalHeight: 1600,
        displayedWidth: 300,
        displayedHeight: 360,
        displayedBox: { x: 20, y: 20, width: 80, height: 100 },
        mistakeType: '审题错误',
        note: '比例异常',
      }),
    ).toThrow('图片显示比例与原图比例不一致');
  });

  it('renders original homework image and correction canvas with draft area coordinates', () => {
    render(
      <TeacherHomeworkCorrectionCanvas
        review={{
          id: 'homework-review-wang-1',
          studentName: '王小明',
          subject: '数学',
          originalImageUrl: '/demo/homework-wang-math.jpg',
          originalImageFileId: 'file-homework-original-wang',
          imageNaturalWidth: 1200,
          imageNaturalHeight: 1600,
          areas: [
            {
              id: 'area-1',
              originalBox: { x: 120, y: 320, width: 360, height: 480 },
              imageNaturalWidth: 1200,
              imageNaturalHeight: 1600,
              mistakeType: '计算错误',
              note: '竖式进位漏写',
              status: 'DRAFT',
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: '作业批改画布' })).toBeInTheDocument();
    expect(screen.getByAltText('王小明的数学作业原图')).toHaveAttribute('src', '/demo/homework-wang-math.jpg');
    expect(screen.getByText('原图尺寸：1200 × 1600')).toBeInTheDocument();
    expect(screen.getByText('区域坐标：x120 / y320 / w360 / h480')).toBeInTheDocument();
    expect(screen.getByText('图片比例和坐标保存一致')).toBeInTheDocument();
  });
});
