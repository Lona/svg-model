import { Rect } from "./primitives";
import * as Commands from "./commands";

export type Style = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineCap?: string;
  strokeOpacity?: number;
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
