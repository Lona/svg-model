import { Point } from "../types/primitives";
import { Move, Line, QuadCurve, CubicCurve, Close } from "../types/commands";

export const move = (to: Point): Move => ({ type: "move", to });

export const line = (to: Point): Line => ({ type: "line", to });

export const quadCurve = (to: Point, controlPoint: Point): QuadCurve => ({
  type: "quadCurve",
  to,
  controlPoint,
});

export const cubicCurve = (
  to: Point,
  controlPoint1: Point,
  controlPoint2: Point
): CubicCurve => ({
  type: "cubicCurve",
  to,
  controlPoint1,
  controlPoint2,
});

export const close = (): Close => ({ type: "close" });
