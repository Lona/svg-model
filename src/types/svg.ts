export type SVGBaseAttributes = {
  id?: string;
  fill?: string;
  stroke?: string;
  "stroke-opacity"?: number;
  "stroke-width"?: string;
  "stroke-linecap"?: string;
  transform?: string;
};

export type SVGRectAttributes = SVGBaseAttributes & {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  ry: number;
};

export type SVGCircleAttributes = SVGBaseAttributes & {
  cx: number;
  cy: number;
  r: number;
};

export type SVGPolygonAttributes = SVGBaseAttributes & {
  points: string;
};

export type SVGPolylineAttributes = SVGBaseAttributes & {
  points: string;
};

export type SVGPathAttributes = SVGBaseAttributes & {
  d: string;
};

export type SVGRootAttributes = SVGBaseAttributes & {
  viewBox: string;
};

export type SVGRect = {
  type: "element";
  name: "rect";
  attributes: SVGRectAttributes;
};

export type SVGCircle = {
  type: "element";
  name: "circle";
  attributes: SVGCircleAttributes;
};

export type SVGPolyline = {
  type: "element";
  name: "polyline";
  attributes: SVGPolylineAttributes;
};

export type SVGPolygon = {
  type: "element";
  name: "polygon";
  attributes: SVGPolygonAttributes;
};

export type SVGPath = {
  type: "element";
  name: "path";
  attributes: SVGPathAttributes;
};

export type SVGGroup = {
  type: "element";
  name: "g";
  attributes: SVGBaseAttributes;
  children: SVGNode[];
};

export type SVGRoot = {
  type: "element";
  name: "svg";
  attributes: SVGRootAttributes;
  children: SVGNode[];
};

export type SVGTitle = {
  type: "element";
  name: "title";
};

export type SVGDesc = {
  type: "element";
  name: "desc";
};

export type SVGParentNode = SVGRoot | SVGGroup;

export type SVGDrawableNode =
  | SVGPath
  | SVGPolyline
  | SVGPolygon
  | SVGCircle
  | SVGRect;

export type SVGNode = SVGParentNode | SVGDrawableNode | SVGTitle | SVGDesc;
