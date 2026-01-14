import type { CustomFaceData } from '@/types/custom-face-data';
import {
  CubemapFormat,
  type CubeFaces,
  type CubemapInfo,
  type ConvertedCubemap,
} from '../types/cubemap';
import { bicubicInterpolate } from './interpolation';

/**
 * Extracts the six faces from a cubemap image based on its detected format.
 * @param image - The source cubemap image.
 * @param info - The detected cubemap information.
 * @returns An object containing the six faces as ImageData, or null on failure.
 */
export function extractFaces(image: HTMLImageElement, info: CubemapInfo): CubeFaces | null {
  // Special handling for equirectangular to cubemap conversion
  if (info.format === CubemapFormat.EQUIRECTANGULAR) {
    return extractFacesFromEquirectangular(image, info.faceSize);
  }

  // Create a temporary canvas to extract face data
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const { faceSize, format } = info;

  canvas.width = faceSize;
  canvas.height = faceSize;

  // Positions of each face in the source image
  const positions = getFacePositions(format, faceSize);

  if (!positions) {
    throw new Error("Couldn't get face positions for format: " + format);
  }

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
): Record<keyof CubeFaces, { x: number; y: number }> | null {
  if (format === CubemapFormat.EQUIRECTANGULAR) {
    // Equirectangular format does not have fixed face positions
    // Return an empty object or handle differently if needed
    return null;
  }

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
      // [right][left]
      // [top][bottom]
      // [front][back]
      return {
        right: { x: 0, y: 0 },
        left: { x: faceSize, y: 0 },
        top: { x: 0, y: faceSize },
        bottom: { x: faceSize, y: faceSize },
        front: { x: 0, y: faceSize * 2 },
        back: { x: faceSize, y: faceSize * 2 },
      };

    case CubemapFormat.ROW_3X2:
      // Layout:
      // [right][left][top]
      // [bottom][front][back]
      return {
        right: { x: 0, y: 0 },
        left: { x: faceSize, y: 0 },
        top: { x: faceSize * 2, y: 0 },
        bottom: { x: 0, y: faceSize },
        front: { x: faceSize, y: faceSize },
        back: { x: faceSize * 2, y: faceSize },
      };

    case CubemapFormat.ROW_6X1:
      // Layout: [right][left][top][bottom][front][back]
      return {
        right: { x: 0, y: 0 },
        left: { x: faceSize, y: 0 },
        top: { x: faceSize * 2, y: 0 },
        bottom: { x: faceSize * 3, y: 0 },
        front: { x: faceSize * 4, y: 0 },
        back: { x: faceSize * 5, y: 0 },
      };

    case CubemapFormat.COLUMN_1X6:
      // Layout:
      // [right]
      // [left]
      // [top]
      // [bottom]
      // [front]
      // [back]
      return {
        right: { x: 0, y: 0 },
        left: { x: 0, y: faceSize },
        top: { x: 0, y: faceSize * 2 },
        bottom: { x: 0, y: faceSize * 3 },
        front: { x: 0, y: faceSize * 4 },
        back: { x: 0, y: faceSize * 5 },
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
  // Special handling for equirectangular projection
  if (targetFormat === CubemapFormat.EQUIRECTANGULAR) {
    return convertToEquirectangular(faces, faceSize);
  }

  const positions = getFacePositions(targetFormat, faceSize);

  if (!positions) {
    throw new Error("Couldn't get face positions for format: " + targetFormat);
  }

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

export function convertToCustomFormat(
  customCubemapData: Record<keyof CubeFaces, CustomFaceData>,
  faces: CubeFaces,
  faceSize: number,
): Omit<ConvertedCubemap, 'format'> | null {
  // Calculate the dimensions of the target image
  const maxX = Math.max(
    ...Object.values(customCubemapData).map((f) => f.position.x * faceSize + faceSize),
  );
  const minX = Math.min(...Object.values(customCubemapData).map((f) => f.position.x * faceSize));
  const maxY = Math.max(
    ...Object.values(customCubemapData).map((f) => f.position.y * faceSize + faceSize),
  );
  const minY = Math.min(...Object.values(customCubemapData).map((f) => f.position.y * faceSize));

  console.log('Min x', minX, ' (', minX / faceSize, 'faces )');
  console.log('Min y', minY, ' (', minY / faceSize, 'faces )');
  console.log('Max x', maxX, ' (', maxX / faceSize, 'faces )');
  console.log('Max y', maxY, ' (', maxY / faceSize, 'faces )');

  const width = maxX - minX;
  const height = maxY - minY;

  //const width = faceSize * 6;
  //const height = faceSize * 6;

  console.log('Width:', width, ' (', width / faceSize, 'faces )');
  console.log('Height:', height, ' (', height / faceSize, 'faces )');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = width;
  canvas.height = height;

  // Draw each face into its position
  for (const [faceName, data] of Object.entries(customCubemapData)) {
    const faceData = faces[faceName as keyof CubeFaces];

    // Create temporary canvas for this face
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return null;

    tempCanvas.width = faceSize;
    tempCanvas.height = faceSize;

    tempCtx.putImageData(faceData, 0, 0);

    if (data.rotation === 0) {
      ctx.drawImage(
        tempCanvas,
        data.position.x * faceSize - minX,
        data.position.y * faceSize - minY,
      );
    } else {
      // Save the context state
      ctx.save();

      // Move to the center of where the face should be
      const centerX = data.position.x * faceSize - minX + faceSize / 2;
      const centerY = data.position.y * faceSize - minY + faceSize / 2;
      ctx.translate(centerX, centerY);

      // Rotate
      ctx.rotate(data.rotation * (Math.PI / 180));

      // Draw the image centered on the rotation point
      ctx.drawImage(tempCanvas, -faceSize / 2, -faceSize / 2);

      // Restore the context state
      ctx.restore();
    }
  }

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width,
    height,
  };
}

/**
 * Sample a color from cubemap faces at a given 3D direction vector.
 * @param faces - The six faces of the cubemap.
 * @param faceSize - The size of each face.
 * @param x - X component of direction vector.
 * @param y - Y component of direction vector.
 * @param z - Z component of direction vector.
 * @returns RGBA color values.
 */
function sampleCubemap(
  faces: CubeFaces,
  faceSize: number,
  x: number,
  y: number,
  z: number,
): [number, number, number, number] {
  // Determine which face to sample from based on largest absolute component
  const absX = Math.abs(x);
  const absY = Math.abs(y);
  const absZ = Math.abs(z);

  let face: ImageData;
  let u: number;
  let v: number;

  // To get u and v : project on the face then normalize

  if (absX >= absY && absX >= absZ) {
    // X-axis dominant
    if (x > 0) {
      // Right face (+X)
      face = faces.right;
      u = (-z / absX + 1) * 0.5;
      v = (-y / absX + 1) * 0.5;
    } else {
      // Left face (-X)
      face = faces.left;
      u = (z / absX + 1) * 0.5;
      v = (-y / absX + 1) * 0.5;
    }
  } else if (absY >= absX && absY >= absZ) {
    // Y-axis dominant
    if (y > 0) {
      // Top face (+Y)
      face = faces.top;
      u = (x / absY + 1) * 0.5;
      v = (z / absY + 1) * 0.5;
    } else {
      // Bottom face (-Y)
      face = faces.bottom;
      u = (x / absY + 1) * 0.5;
      v = (-z / absY + 1) * 0.5;
    }
  } else {
    // Z-axis dominant
    if (z > 0) {
      // Front face (+Z)
      face = faces.front;
      u = (x / absZ + 1) * 0.5;
      v = (-y / absZ + 1) * 0.5;
    } else {
      // Back face (-Z)
      face = faces.back;
      u = (-x / absZ + 1) * 0.5;
      v = (-y / absZ + 1) * 0.5;
    }
  }

  // Bicubic interpolation for better quality
  return bicubicInterpolate(u, v, face, faceSize);
}

/**
 * Convert cubemap faces to equirectangular projection.
 * @param faces - The six faces of the cubemap.
 * @param faceSize - The size of each face.
 * @returns The converted equirectangular image.
 */
function convertToEquirectangular(faces: CubeFaces, faceSize: number): ConvertedCubemap | null {
  // Equirectangular dimensions: 2:1 ratio, higher resolution for better quality
  const width = faceSize * 8; // Increased from 4 to 8 for better quality
  const height = faceSize * 4; // Increased from 2 to 4

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = width;
  canvas.height = height;

  const imageData = ctx.createImageData(width, height);

  // For each pixel in the equirectangular image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Convert pixel coordinates to UV (0 to 1)
      const u = x / width;
      const v = y / height;

      // Convert UV to spherical coordinates
      // Offset theta so +Z (front) is at the center (u = 0.5)
      const theta = (u - 0.5) * 2 * Math.PI; // Longitude
      const phi = v * Math.PI; // Latitude (0 to π)

      // Convert spherical to 3D Cartesian coordinates
      const sinPhi = Math.sin(phi);
      const dx = sinPhi * Math.sin(theta);
      const dy = Math.cos(phi);
      const dz = sinPhi * Math.cos(theta);

      // Sample the cubemap at this direction
      const [r, g, b, a] = sampleCubemap(faces, faceSize, dx, dy, dz);

      // Set pixel in output image
      const index = (y * width + x) * 4;
      imageData.data[index] = r;
      imageData.data[index + 1] = g;
      imageData.data[index + 2] = b;
      imageData.data[index + 3] = a;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    format: CubemapFormat.EQUIRECTANGULAR,
    dataUrl: canvas.toDataURL('image/png'),
    width,
    height,
  };
}

/**
 * Extract cubemap faces from an equirectangular image.
 * @param image - The source equirectangular image.
 * @param faceSize - The desired size of each face.
 * @returns The six extracted faces.
 */
function extractFacesFromEquirectangular(
  image: HTMLImageElement,
  faceSize: number,
): CubeFaces | null {
  // Create a canvas to draw the source image
  const sourceCanvas = document.createElement('canvas');
  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) return null;

  sourceCanvas.width = image.width;
  sourceCanvas.height = image.height;
  sourceCtx.drawImage(image, 0, 0);

  const sourceData = sourceCtx.getImageData(0, 0, image.width, image.height);

  // Helper function to sample the equirectangular image
  const sampleEquirect = (theta: number, phi: number): [number, number, number, number] => {
    // Normalize theta to 0-1 range (centered around +Z)
    let u = (theta / (2 * Math.PI) + 0.5) % 1;
    if (u < 0) u += 1;

    // Normalize phi to 0-1 range
    const v = phi / Math.PI;

    // Convert to pixel coordinates
    const x = Math.max(0, Math.min(image.width - 1, Math.floor(u * image.width)));
    const y = Math.max(0, Math.min(image.height - 1, Math.floor(v * image.height)));

    const index = (y * image.width + x) * 4;
    return [
      sourceData.data[index] ?? 0,
      sourceData.data[index + 1] ?? 0,
      sourceData.data[index + 2] ?? 0,
      sourceData.data[index + 3] ?? 255,
    ];
  };

  // Generate each face
  const faces: Partial<CubeFaces> = {};

  // Face configurations: [name, xDir, yDir, zDir]
  const faceConfigs: Array<[keyof CubeFaces, (u: number, v: number) => [number, number, number]]> =
    [
      ['front', (u, v) => [u * 2 - 1, -(v * 2 - 1), 1]], // +Z
      ['back', (u, v) => [-(u * 2 - 1), -(v * 2 - 1), -1]], // -Z
      ['left', (u, v) => [-1, -(v * 2 - 1), u * 2 - 1]], // -X
      ['right', (u, v) => [1, -(v * 2 - 1), -(u * 2 - 1)]], // +X
      ['top', (u, v) => [u * 2 - 1, 1, v * 2 - 1]], // +Y
      ['bottom', (u, v) => [u * 2 - 1, -1, -(v * 2 - 1)]], // -Y
    ];

  for (const [faceName, getDirection] of faceConfigs) {
    const faceData = new ImageData(faceSize, faceSize);

    for (let y = 0; y < faceSize; y++) {
      for (let x = 0; x < faceSize; x++) {
        // Convert pixel to UV coordinates (0 to 1)
        const u = (x + 0.5) / faceSize;
        const v = (y + 0.5) / faceSize;

        // Get the 3D direction vector for this face pixel
        const [dx, dy, dz] = getDirection(u, v);

        // Normalize the vector
        const length = Math.hypot(dx, dy, dz);
        const nx = dx / length;
        const ny = dy / length;
        const nz = dz / length;

        // Convert to spherical coordinates
        const theta = Math.atan2(nx, nz);
        const phi = Math.acos(ny);

        // Sample the equirectangular image
        const [r, g, b, a] = sampleEquirect(theta, phi);

        // Set pixel in face
        const index = (y * faceSize + x) * 4;
        faceData.data[index] = r;
        faceData.data[index + 1] = g;
        faceData.data[index + 2] = b;
        faceData.data[index + 3] = a;
      }
    }

    faces[faceName] = faceData;
  }

  return faces as CubeFaces;
}
