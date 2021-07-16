import { Rect } from "./primitives";
import * as Commands from "./commands";
import parseCSSColor from "./parse-css-color";

export type LineCap = "butt" | "round" | "square";

export type FillRule = "nonzero" | "evenodd";

/**
 * We use different defaults in our model than the SVG spec.
 *
 * The SVG defaults are convenient for writing SVG files, but less convenient for drawing.
 * We get rid of the value 'none', instead using undefined (or no key).
 *
 * Model defaults:
 * - fill: undefined
 * - stroke: undefined
 * - strokeWidth: 0
 * - strokeLineCap: 'butt'
 *
 * SVG defaults:
 * - fill: 'black'
 * - stroke: 'none'
 * - strokeWidth: 1
 * - strokeLineCap: 'butt'
 */
export type Style = {
  fill?: string;
  fillRule: FillRule;
  stroke?: string;
  strokeWidth: number;
  strokeLineCap: LineCap;
};

export type Path = {
  id: string;
  commands: Commands.Command[];
  style: Style;
};

export type SVG = {
  children: Path[];
  viewBox?: Rect;
  metadata: {
    unsupportedFeatures: string[];
  };
};

function applyOpacity(color: string, opacity: number): string {
  const [r, g, b, a] = parseCSSColor(color) ?? [255, 255, 255, 1];

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
  fillRule,
  stroke,
  strokeWidth,
  strokeLineCap,
  strokeOpacity,
}: {
  fill?: string;
  fillOpacity?: number;
  fillRule?: string;
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
  fillRule: fillRule === "evenodd" ? fillRule : "nonzero",
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
  id: "",
  commands,
  style,
});

export const svg = (
  viewBox: Rect | undefined,
  unsupportedFeatures: string[]
): SVG => ({
  children: [],
  ...(viewBox && { viewBox }),
  metadata: {
    unsupportedFeatures,
  },
});
