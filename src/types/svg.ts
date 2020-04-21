export type SVGAttributes = {
  id: string;
  d: string;
  fill: string;
  stroke: string;
  "stroke-opacity": number;
  "stroke-width": string;
  "stroke-linecap": string;
  viewBox: string;
  transform: string;
  [key: string]: any;
};

export type SVGNode = {
  type?: string;
  name: string;
  attributes: SVGAttributes;
  children?: SVGNode[];
};
