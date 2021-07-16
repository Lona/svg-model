import { Rect } from "../types/primitives";
import { Style, Path, SVG, LineCap } from "../types/elements";
import * as Commands from "../types/commands";
import parseCSSColor from "../parse-css-color";

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
  params: {
    ...(viewBox && { viewBox }),
  },
  metadata: {
    unsupportedFeatures,
  },
});
