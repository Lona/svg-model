import { Point, Size, Rect, PointString } from "./primitives";
import * as Commands from "./commands";

export type Style = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineCap?: string;
  strokeOpacity?: number;
};

export type Path = {
  type: "path";
  path: string[];
  data: {
    params: {
      commands: Commands.Command[];
      style: Style;
    };
  };
};

export type SVG = {
  type: "svg";
  path: string[];
  data: {
    children: ChildElement[];
    params: {
      viewBox?: Rect;
    };
  };
};

export type ChildElement = Path;

export type Element = SVG | Path;
