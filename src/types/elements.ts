import { Rect } from "./primitives";
import * as Commands from "./commands";

export type LineCap = "butt" | "round" | "square";

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
  stroke?: string;
  strokeWidth: number;
  strokeLineCap: LineCap;
};

export type PathData = {
  params: {
    commands: Commands.Command[];
    style: Style;
  };
};

export type Path = {
  type: "path";
  id: string;
  data: PathData;
};

export type SVGData = {
  children: ChildElement[];
  params: {
    viewBox?: Rect;
  };
};

export type SVG = {
  type: "svg";
  id: string;
  data: SVGData;
};

export type ChildElement = Path;
