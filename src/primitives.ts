export type Point = { x: number; y: number };

export type Size = { width: number; height: number };

export type Rect = Point & Size;

export const point = (x: number, y: number): Point => ({ x, y });

export const rect = (
  x: number,
  y: number,
  width: number,
  height: number
): Rect => ({
  x,
  y,
  width,
  height,
});
