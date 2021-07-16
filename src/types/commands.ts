import { Point } from "./primitives";

export type Move = { type: "move"; to: Point };

export type Line = { type: "line"; to: Point };

export type QuadCurve = {
  type: "quadCurve";
  to: Point;
  controlPoint: Point;
};

export type CubicCurve = {
  type: "cubicCurve";
  to: Point;
  controlPoint1: Point;
  controlPoint2: Point;
};

export type Close = { type: "close" };

export type Command = Move | Line | QuadCurve | CubicCurve | Close;
