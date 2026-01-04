export type Position = {
  x: number;
  y: number;
};

const generatePositions = (): Position[] => {
  const positions: Position[] = [];

  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      positions.push({ x, y });
    }
  }

  return positions;
};

export const CUBEMAP_POSITIONS = generatePositions();
