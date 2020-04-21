import { Point, Size, Rect, PointString } from "./primitives";
import * as Commands from "./commands";

export type Style = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineCap?: string;
  strokeOpacity?: number;
};

export type Circle = {
  type: "circle";
  path: string[];
  data: {
    params: {
      center: Point;
      radius: number;
      style: Style;
    };
  };
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

export type Group = {
  type: "group";
  path: string[];
  data: {
    children: ChildElement[];
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

export type ChildElement = Circle | Path | Group;

export type Element = SVG | Circle | Path | Group;
