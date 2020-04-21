import { Point } from "./primitives";

export type Move = { type: "move"; data: { to: Point } };

export type Line = { type: "line"; data: { to: Point } };

export type QuadCurve = {
  type: "quadCurve";
  data: {
    to: Point;
    controlPoint: Point;
  };
};

export type CubicCurve = {
  type: "cubicCurve";
  data: {
    to: Point;
    controlPoint1: Point;
    controlPoint2: Point;
  };
};

export type Close = { type: "close" };

export type Command = Move | Line | QuadCurve | CubicCurve | Close;
