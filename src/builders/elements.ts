import { Point, Rect } from "../types/primitives";
import { Style, Circle, Path, SVG } from "../types/elements";
import * as Commands from "../types/commands";

const parseCSSColor: (color: string) => number[] = require("csscolorparser")
  .parseCSSColor;

function applyOpacity(color: string, opacity: number): string {
  const [r, g, b, a] = parseCSSColor(color);

  if (opacity >= 1) return color;

  return `rgba(${r},${g},${b},${a * opacity})`;
}

export const style = (
  fill: string | undefined,
  stroke: string | undefined,
  strokeWidth: number | undefined,
  strokeLineCap: string | undefined,
  strokeOpacity: number
) => ({
  ...(fill !== "none" && { fill: fill || "black" }),
  ...(stroke &&
    stroke !== "none" && { stroke: applyOpacity(stroke, strokeOpacity) }),
  strokeWidth: strokeWidth != null ? strokeWidth : 1,
  strokeLineCap: strokeLineCap || "butt",
});

export const circle = (
  style: Style,
  center: Point,
  radius: number
): Circle => ({
  type: "circle",
  path: [],
  data: {
    params: {
      center,
      radius,
      style,
    },
  },
});

export const path = (style: Style, commands: Commands.Command[]): Path => ({
  type: "path",
  path: [],
  data: {
    params: {
      commands,
      style,
    },
  },
});

export const svg = (viewBox: Rect): SVG => ({
  type: "svg",
  path: [],
  data: {
    children: [],
    params: {
      ...(viewBox && { viewBox }),
    },
  },
});