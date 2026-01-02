import {
  CubemapFormat,
  type CubeFaces,
  type CubemapInfo,
  type ConvertedCubemap,
} from '../types/cubemap';

/**
 * Extracts the six faces from a cubemap image based on its detected format.
 * @param image - The source cubemap image.
 * @param info - The detected cubemap information.
 * @returns An object containing the six faces as ImageData, or null on failure.
 */
export function extractFaces(image: HTMLImageElement, info: CubemapInfo): CubeFaces | null {
  // Create a temporary canvas to extract face data
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const { faceSize, format } = info;

  canvas.width = faceSize;
  canvas.height = faceSize;

  // Positions of each face in the source image
  const positions = getFacePositions(format, faceSize);

  const faces: Partial<CubeFaces> = {};

  for (const [faceName, position] of Object.entries(positions)) {
    ctx.clearRect(0, 0, faceSize, faceSize);
    ctx.drawImage(image, position.x, position.y, faceSize, faceSize, 0, 0, faceSize, faceSize);
    faces[faceName as keyof CubeFaces] = ctx.getImageData(0, 0, faceSize, faceSize);
  }

  return faces as CubeFaces;
}

/**
 * Gets the positions of each face in the cubemap image based on its format.
 * @param format - The cubemap format.
 * @param faceSize - The size of each face.
 * @returns A record mapping face names to their x and y positions.
 */
function getFacePositions(
  format: CubemapFormat,
  faceSize: number,
): Record<keyof CubeFaces, { x: number; y: number }> {
  switch (format) {
    case CubemapFormat.HORIZONTAL_CROSS:
      // Layout:
      //       [top]
      // [left][front][right][back]
      //       [bottom]
      return {
        front: { x: faceSize, y: faceSize },
        back: { x: faceSize * 3, y: faceSize },
        left: { x: 0, y: faceSize },
        right: { x: faceSize * 2, y: faceSize },
        top: { x: faceSize, y: 0 },
        bottom: { x: faceSize, y: faceSize * 2 },
      };

    case CubemapFormat.VERTICAL_CROSS:
      // Layout:
      //       [top]
      // [left][front][right]
      //       [bottom]
      //       [back]
      return {
        front: { x: faceSize, y: faceSize },
        back: { x: faceSize, y: faceSize * 3 },
        left: { x: 0, y: faceSize },
        right: { x: faceSize * 2, y: faceSize },
        top: { x: faceSize, y: 0 },
        bottom: { x: faceSize, y: faceSize * 2 },
      };

    case CubemapFormat.COLUMN_2X3:
      // Layout:
      // [left][right]
      // [top][bottom]
      // [front][back]
      return {
        left: { x: 0, y: 0 },
        right: { x: faceSize, y: 0 },
        top: { x: 0, y: faceSize },
        bottom: { x: faceSize, y: faceSize },
        front: { x: 0, y: faceSize * 2 },
        back: { x: faceSize, y: faceSize * 2 },
      };

    case CubemapFormat.ROW_3X2:
      // Layout:
      // [front][back][left]
      // [right][top][bottom]
      return {
        front: { x: 0, y: 0 },
        back: { x: faceSize, y: 0 },
        left: { x: faceSize * 2, y: 0 },
        right: { x: 0, y: faceSize },
        top: { x: faceSize, y: faceSize },
        bottom: { x: faceSize * 2, y: faceSize },
      };

    case CubemapFormat.ROW_6X1:
      // Layout: [front][back][left][right][top][bottom]
      return {
        front: { x: 0, y: 0 },
        back: { x: faceSize, y: 0 },
        left: { x: faceSize * 2, y: 0 },
        right: { x: faceSize * 3, y: 0 },
        top: { x: faceSize * 4, y: 0 },
        bottom: { x: faceSize * 5, y: 0 },
      };

    case CubemapFormat.COLUMN_1X6:
      // Layout:
      // [front]
      // [back]
      // [left]
      // [right]
      // [top]
      // [bottom]
      return {
        front: { x: 0, y: 0 },
        back: { x: 0, y: faceSize },
        left: { x: 0, y: faceSize * 2 },
        right: { x: 0, y: faceSize * 3 },
        top: { x: 0, y: faceSize * 4 },
        bottom: { x: 0, y: faceSize * 5 },
      };
  }
}

/**
 * Convert the cubemap faces to a specified target format.
 * @param faces - The six faces of the cubemap.
 * @param targetFormat - The desired target format.
 * @param faceSize - The size of each face.
 * @returns The converted cubemap as a data URL, or null on failure.
 */
export function convertToFormat(
  faces: CubeFaces,
  targetFormat: CubemapFormat,
  faceSize: number,
): ConvertedCubemap | null {
  const positions = getFacePositions(targetFormat, faceSize);

  // Calculate the dimensions of the target image
  let width = 0;
  let height = 0;

  switch (targetFormat) {
    case CubemapFormat.HORIZONTAL_CROSS:
      width = faceSize * 4;
      height = faceSize * 3;
      break;
    case CubemapFormat.VERTICAL_CROSS:
      width = faceSize * 3;
      height = faceSize * 4;
      break;
    case CubemapFormat.COLUMN_2X3:
      width = faceSize * 2;
      height = faceSize * 3;
      break;
    case CubemapFormat.ROW_3X2:
      width = faceSize * 3;
      height = faceSize * 2;
      break;
    case CubemapFormat.ROW_6X1:
      width = faceSize * 6;
      height = faceSize;
      break;
    case CubemapFormat.COLUMN_1X6:
      width = faceSize;
      height = faceSize * 6;
      break;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = width;
  canvas.height = height;

  // Draw each face into its position in the target format
  for (const [faceName, position] of Object.entries(positions)) {
    const faceData = faces[faceName as keyof CubeFaces];
    ctx.putImageData(faceData, position.x, position.y);
  }

  return {
    format: targetFormat,
    dataUrl: canvas.toDataURL('image/png'),
    width,
    height,
  };
}

/**
 * Convert a source image to all available cubemap formats.
 * @param faces - The six faces of the cubemap.
 * @param sourceInfo - Information about the source cubemap format.
 * @returns An array of converted cubemaps in different formats.
 */
export function convertToAllFormats(faces: CubeFaces, sourceInfo: CubemapInfo): ConvertedCubemap[] {
  const allFormats = Object.values(CubemapFormat);
  const results: ConvertedCubemap[] = [];

  for (const format of allFormats) {
    if (format === sourceInfo.format) continue;

    const converted = convertToFormat(faces, format, sourceInfo.faceSize);
    if (converted) {
      results.push(converted);
    }
  }

  return results;
}
