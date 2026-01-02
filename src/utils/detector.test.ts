import { describe, it, expect } from 'vitest';
import { detectCubemapFormat } from './detector';
import { CubemapFormat } from '../types/cubemap';

describe('detectCubemapFormat', () => {
  describe('Horizontal Cross (4x3)', () => {
    it('should detect 4x3 cross format with 100px faces', () => {
      const result = detectCubemapFormat(400, 300);
      expect(result).not.toBeNull();
      expect(result?.format).toBe(CubemapFormat.HORIZONTAL_CROSS);
      expect(result?.faceSize).toBe(100);
      expect(result?.width).toBe(400);
      expect(result?.height).toBe(300);
    });
  });

  describe('Vertical Cross (3x4)', () => {
    it('should detect 3x4 cross format with 100px faces', () => {
      const result = detectCubemapFormat(300, 400);
      expect(result).not.toBeNull();
      expect(result?.format).toBe(CubemapFormat.VERTICAL_CROSS);
      expect(result?.faceSize).toBe(100);
      expect(result?.width).toBe(300);
      expect(result?.height).toBe(400);
    });
  });

  describe('2x3 Column Grid', () => {
    it('should detect 2x3 grid format with 100px faces', () => {
      const result = detectCubemapFormat(200, 300);
      expect(result).not.toBeNull();
      expect(result?.format).toBe(CubemapFormat.COLUMN_2X3);
      expect(result?.faceSize).toBe(100);
      expect(result?.width).toBe(200);
      expect(result?.height).toBe(300);
    });
  });

  describe('3x2 Row Grid', () => {
    it('should detect 3x2 grid format with 100px faces', () => {
      const result = detectCubemapFormat(300, 200);
      expect(result).not.toBeNull();
      expect(result?.format).toBe(CubemapFormat.ROW_3X2);
      expect(result?.faceSize).toBe(100);
      expect(result?.width).toBe(300);
      expect(result?.height).toBe(200);
    });
  });

  describe('6x1 Row Layout', () => {
    it('should detect 6x1 row format with 100px faces', () => {
      const result = detectCubemapFormat(600, 100);
      expect(result).not.toBeNull();
      expect(result?.format).toBe(CubemapFormat.ROW_6X1);
      expect(result?.faceSize).toBe(100);
      expect(result?.width).toBe(600);
      expect(result?.height).toBe(100);
    });
  });

  describe('1x6 Column Layout', () => {
    it('should detect 1x6 column format with 100px faces', () => {
      const result = detectCubemapFormat(100, 600);
      expect(result).not.toBeNull();
      expect(result?.format).toBe(CubemapFormat.COLUMN_1X6);
      expect(result?.faceSize).toBe(100);
      expect(result?.width).toBe(100);
      expect(result?.height).toBe(600);
    });
  });

  describe('Invalid formats', () => {
    it('should return null for dimensions that do not match any format', () => {
      expect(detectCubemapFormat(200, 100)).toBeNull();
      expect(detectCubemapFormat(100, 100)).toBeNull();
    });

    it('should return null for zero or negative dimensions', () => {
      expect(detectCubemapFormat(0, 0)).toBeNull();
      expect(detectCubemapFormat(-100, 100)).toBeNull();
      expect(detectCubemapFormat(100, -100)).toBeNull();
    });
  });
});
