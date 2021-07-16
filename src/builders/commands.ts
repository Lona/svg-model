import { Point } from "../types/primitives";

export const move = (to: Point) => ({ type: "move", to } as const);

export const line = (to: Point) => ({ type: "line", to } as const);

export const quadCurve = (to: Point, controlPoint: Point) =>
  ({
    type: "quadCurve",
    to,
    controlPoint,
  } as const);

export const cubicCurve = (
  to: Point,
  controlPoint1: Point,
  controlPoint2: Point
) =>
  ({
    type: "cubicCurve",
    to,
    controlPoint1,
    controlPoint2,
  } as const);

export const close = () => ({ type: "close" } as const);

export type Move = ReturnType<typeof move>;
export type Line = ReturnType<typeof line>;
export type QuadCurve = ReturnType<typeof quadCurve>;
export type CubicCurve = ReturnType<typeof cubicCurve>;
export type Close = ReturnType<typeof close>;
export type Command = Move | Line | QuadCurve | CubicCurve | Close;
