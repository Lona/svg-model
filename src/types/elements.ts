import { Rect } from "./primitives";
import * as Commands from "./commands";

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
  params: {
    viewBox?: Rect;
  };
  metadata: {
    unsupportedFeatures: string[];
  };
};
