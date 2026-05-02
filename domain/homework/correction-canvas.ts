export type HomeworkCorrectionBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HomeworkCorrectionAreaStatus = 'DRAFT' | 'CONFIRMED' | 'IGNORED';

export type HomeworkCorrectionArea = {
  id: string;
  originalBox: HomeworkCorrectionBox;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
  mistakeType: string;
  note: string;
  status: HomeworkCorrectionAreaStatus;
};

export type HomeworkCorrectionAreaDraftInput = {
  id: string;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
  displayedWidth: number;
  displayedHeight: number;
  displayedBox: HomeworkCorrectionBox;
  mistakeType: string;
  note: string;
};

export function createHomeworkCorrectionAreaDraft(input: HomeworkCorrectionAreaDraftInput): HomeworkCorrectionArea {
  assertPositiveDimensions(input);
  assertSameImageRatio(input);

  const scaleX = input.imageNaturalWidth / input.displayedWidth;
  const scaleY = input.imageNaturalHeight / input.displayedHeight;

  return {
    id: input.id,
    originalBox: {
      x: Math.round(input.displayedBox.x * scaleX),
      y: Math.round(input.displayedBox.y * scaleY),
      width: Math.round(input.displayedBox.width * scaleX),
      height: Math.round(input.displayedBox.height * scaleY),
    },
    imageNaturalWidth: input.imageNaturalWidth,
    imageNaturalHeight: input.imageNaturalHeight,
    mistakeType: input.mistakeType,
    note: input.note,
    status: 'DRAFT',
  };
}

function assertPositiveDimensions(input: HomeworkCorrectionAreaDraftInput) {
  if (
    input.imageNaturalWidth <= 0 ||
    input.imageNaturalHeight <= 0 ||
    input.displayedWidth <= 0 ||
    input.displayedHeight <= 0 ||
    input.displayedBox.width <= 0 ||
    input.displayedBox.height <= 0
  ) {
    throw new Error('图片和区域尺寸必须大于 0');
  }
}

function assertSameImageRatio(input: HomeworkCorrectionAreaDraftInput) {
  const naturalRatio = input.imageNaturalWidth / input.imageNaturalHeight;
  const displayedRatio = input.displayedWidth / input.displayedHeight;

  if (Math.abs(naturalRatio - displayedRatio) > 0.01) {
    throw new Error('图片显示比例与原图比例不一致');
  }
}
