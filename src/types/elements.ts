import { Point, Size, Rect, PointString } from "./primitives";
import * as Commands from "./commands";
import { SVGAttributes } from "./svg";

export type Style = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineCap?: string;
  strokeOpacity?: number;
};

export type Circle = {
  type: "circle";
  data: {
    elementPath: string[];
    params: {
      center: Point;
      radius: number;
      style: Style;
    };
  };
};

export type Path = {
  type: "path";
  data: {
    elementPath: string[];
    params: {
      commands: Commands.Command[];
      style: Style;
    };
  };
};

export type Group = {
  type: "group";
  context: SVGAttributes;
  data: {
    elementPath: string[];
    children: Element[];
  };
};

export type SVG = {
  type: "svg";
  data: {
    elementPath: string[];
    children: Element[];
    params: {
      viewBox?: Rect;
    };
  };
};

export type Element = SVG | Circle | Path | Group;
