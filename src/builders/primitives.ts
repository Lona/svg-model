import { Point, Rect } from "../types/primitives";

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
