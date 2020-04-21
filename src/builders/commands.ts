import { Point } from "../types/primitives";
import { Move, Line, QuadCurve, CubicCurve, Close } from "../types/commands";

export const move = (to: Point): Move => ({ type: "move", data: { to } });

export const line = (to: Point): Line => ({ type: "line", data: { to } });

export const quadCurve = (to: Point, controlPoint: Point): QuadCurve => ({
  type: "quadCurve",
  data: {
    to,
    controlPoint,
  },
});

export const cubicCurve = (
  to: Point,
  controlPoint1: Point,
  controlPoint2: Point
): CubicCurve => ({
  type: "cubicCurve",
  data: {
    to,
    controlPoint1,
    controlPoint2,
  },
});

export const close = (): Close => ({ type: "close" });
