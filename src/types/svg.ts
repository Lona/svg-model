export type SVGBaseAttributes = {
  id?: string;
  fill?: string;
  "fill-opacity"?: number;
  stroke?: string;
  "stroke-opacity"?: number;
  "stroke-width"?: string;
  "stroke-linecap"?: string;
  transform?: string;
  mask?: string;
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

export type SVGUseAttributes = SVGBaseAttributes & {
  "xlink:href"?: string;
  href?: string;
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

export type SVGMask = {
  type: "element";
  name: "mask";
  attributes: SVGBaseAttributes;
};

export type SVGUse = {
  type: "element";
  name: "use";
  attributes: SVGUseAttributes;
};

export type SVGGroup = {
  type: "element";
  name: "g";
  attributes: SVGBaseAttributes;
  children: SVGChildNode[];
};

export type SVGDefs = {
  type: "element";
  name: "defs";
  children: SVGChildNode[];
};

export type SVGRoot = {
  type: "element";
  name: "svg";
  attributes: SVGRootAttributes;
  children: (SVGChildNode | SVGDefs)[];
};

export type SVGUnknown = {
  type: "element";
  name: "title" | "desc";
};

export type SVGPathConvertibleNode =
  | SVGPath
  | SVGPolyline
  | SVGPolygon
  | SVGCircle
  | SVGRect;

export type SVGDrawableNode = SVGPathConvertibleNode | SVGUse;

export type SVGChildNode =
  | SVGDefs
  | SVGMask
  | SVGGroup
  | SVGDrawableNode
  | SVGUnknown;

export type SVGNode = SVGRoot | SVGChildNode;
