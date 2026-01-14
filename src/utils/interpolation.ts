/**
 * Cubic weight calculation.
 * @param t Fractional part between pixels.
 * @returns Weights for the four neighboring pixels.
 */
const cubicWeight = (t: number): [number, number, number, number] => {
  const t2 = t * t;
  const t3 = t2 * t;

  return [
    -0.5 * t3 + t2 - 0.5 * t, // w0
    1.5 * t3 - 2.5 * t2 + 1, // w1
    -1.5 * t3 + 2 * t2 + 0.5 * t, // w2
    0.5 * t3 - 0.5 * t2, // w3
  ];
};

/**
 * Get the pixel color for a face at (x, y) with clamping.
 * @param x X coordinate.
 * @param y Y coordinate.
 * @param face ImageData of the face.
 * @param faceSize Size of the face (width/height).
 * @returns RGBA color of the pixel.
 */
const getPixel = (
  x: number,
  y: number,
  face: ImageData,
  faceSize: number,
): [number, number, number, number] => {
  const clampedX = Math.max(0, Math.min(faceSize - 1, x));
  const clampedY = Math.max(0, Math.min(faceSize - 1, y));

  // Calculate index in the ImageData array
  const index = (clampedY * faceSize + clampedX) * 4;

  return [
    face.data[index] ?? 0,
    face.data[index + 1] ?? 0,
    face.data[index + 2] ?? 0,
    face.data[index + 3] ?? 255,
  ];
};

export function bicubicInterpolate(
  u: number,
  v: number,
  face: ImageData,
  faceSize: number,
): [number, number, number, number] {
  // Position (can fall between pixels)
  const positionX = u * faceSize - 0.5;
  const positionY = v * faceSize - 0.5;

  // Pixel position
  const flooredX = Math.floor(positionX);
  const flooredY = Math.floor(positionY);

  // Fractional part (distance to next pixel)
  const fractionalX = positionX - flooredX;
  const fractionalY = positionY - flooredY;

  const weightX = cubicWeight(fractionalX);
  const weightY = cubicWeight(fractionalY);

  // Bicubic interpolation on 4x4 grid
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;

  for (let yOffset = 0; yOffset < 4; yOffset++) {
    for (let xOffset = 0; xOffset < 4; xOffset++) {
      const [pr, pg, pb, pa] = getPixel(
        flooredX - 1 + xOffset,
        flooredY - 1 + yOffset,
        face,
        faceSize,
      );
      const weight = (weightX[xOffset] ?? 0) * (weightY[yOffset] ?? 0);
      r += pr * weight;
      g += pg * weight;
      b += pb * weight;
      a += pa * weight;
    }
  }

  // Clamp values to valid range
  return [
    Math.max(0, Math.min(255, r)),
    Math.max(0, Math.min(255, g)),
    Math.max(0, Math.min(255, b)),
    Math.max(0, Math.min(255, a)),
  ];
}
