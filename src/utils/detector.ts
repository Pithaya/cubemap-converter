import { CubemapFormat, type CubemapInfo } from '../types/cubemap';

/**
 * Automatically detects the format of a cubemap based on its dimensions.
 * @param width - The width of the cubemap image.
 * @param height - The height of the cubemap image.
 * @returns The detected cubemap format and face size, or null if not recognized.
 */
export function detectCubemapFormat(width: number, height: number): CubemapInfo | null {
  // Horizontal Cross (4×3)
  if (width % 4 === 0 && height % 3 === 0) {
    const faceSize = width / 4;
    if (faceSize === height / 3) {
      return {
        format: CubemapFormat.HORIZONTAL_CROSS,
        faceSize,
        width,
        height,
      };
    }
  }

  // Vertical Cross (3×4)
  if (width % 3 === 0 && height % 4 === 0) {
    const faceSize = width / 3;
    if (faceSize === height / 4) {
      return {
        format: CubemapFormat.VERTICAL_CROSS,
        faceSize,
        width,
        height,
      };
    }
  }

  // 2×3 Grid
  if (width % 2 === 0 && height % 3 === 0) {
    const faceSize = width / 2;
    if (faceSize === height / 3) {
      return {
        format: CubemapFormat.COLUMN_2X3,
        faceSize,
        width,
        height,
      };
    }
  }

  // 3×2 Grid
  if (width % 3 === 0 && height % 2 === 0) {
    const faceSize = width / 3;
    if (faceSize === height / 2) {
      return {
        format: CubemapFormat.ROW_3X2,
        faceSize,
        width,
        height,
      };
    }
  }

  // 6×1 Row
  if (width % 6 === 0) {
    const faceSize = width / 6;
    if (faceSize === height) {
      return {
        format: CubemapFormat.ROW_6X1,
        faceSize,
        width,
        height,
      };
    }
  }

  // 1×6 Column
  if (height % 6 === 0) {
    const faceSize = height / 6;
    if (faceSize === width) {
      return {
        format: CubemapFormat.COLUMN_1X6,
        faceSize,
        width,
        height,
      };
    }
  }

  return null;
}
