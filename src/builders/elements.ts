import { Rect } from "../types/primitives";
import { Style, Path, SVG, LineCap } from "../types/elements";
import * as Commands from "../types/commands";

const parseCSSColor: (color: string) => number[] = require("csscolorparser")
  .parseCSSColor;

function applyOpacity(color: string, opacity: number): string {
  const [r, g, b, a] = parseCSSColor(color);

  if (opacity >= 1) return color;

  return `rgba(${r},${g},${b},${a * opacity})`;
}

const validateLineCap = (lineCap: string): LineCap => {
  if (lineCap !== "butt" && lineCap !== "round" && lineCap !== "square") {
    console.error(`Unsupported line cap value: ${lineCap}`);
    return "butt";
  }

  return lineCap;
};

/**
 * Convert SVG properties to our model format.
 *
 * We apply default values and convert them to a more convenient model for drawing.
 */
export const style = ({
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  strokeLineCap,
  strokeOpacity,
}: {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeLineCap?: string;
  strokeOpacity?: number;
} = {}): Style => ({
  ...(fill !== "none" && {
    fill: applyOpacity(
      fill || "black",
      typeof fillOpacity === "number" ? fillOpacity : 1
    ),
  }),
  ...(stroke &&
    stroke !== "none" && {
      stroke: applyOpacity(
        stroke,
        typeof strokeOpacity === "number" ? strokeOpacity : 1
      ),
    }),
  strokeWidth: strokeWidth != null ? strokeWidth : 1,
  strokeLineCap: strokeLineCap ? validateLineCap(strokeLineCap) : "butt",
});

export const path = (style: Style, commands: Commands.Command[]): Path => ({
  type: "path",
  id: "",
  data: {
    params: {
      commands,
      style,
    },
  },
});

export const svg = (viewBox: Rect): SVG => ({
  children: [],
  params: {
    ...(viewBox && { viewBox }),
  },
});
