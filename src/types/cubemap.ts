export enum CubemapFormat {
  HORIZONTAL_CROSS = 'horizontal_cross',
  VERTICAL_CROSS = 'vertical_cross',
  COLUMN_2X3 = 'column_2x3',
  ROW_3X2 = 'row_3x2',
  COLUMN_1X6 = 'column_1x6',
  ROW_6X1 = 'row_6x1',
}

export interface CubeFaces {
  front: ImageData;
  back: ImageData;
  left: ImageData;
  right: ImageData;
  top: ImageData;
  bottom: ImageData;
}

export interface CubemapInfo {
  format: CubemapFormat;
  faceSize: number;
  width: number;
  height: number;
}

export interface ConvertedCubemap {
  format: CubemapFormat;
  dataUrl: string;
  width: number;
  height: number;
}

export const FORMAT_LABELS: Record<CubemapFormat, string> = {
  [CubemapFormat.HORIZONTAL_CROSS]: 'Horizontal Cross (4x3)',
  [CubemapFormat.VERTICAL_CROSS]: 'Vertical Cross (3x4)',
  [CubemapFormat.COLUMN_2X3]: '2x3 Grid',
  [CubemapFormat.ROW_3X2]: '3x2 Grid',
  [CubemapFormat.COLUMN_1X6]: '1x6 Column',
  [CubemapFormat.ROW_6X1]: '6x1 Row',
};
