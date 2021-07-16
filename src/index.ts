import { ConvertOptions, convertRoot } from "./node";
import { SVGRoot } from "./svg-types";
import { SVG, SVGWithoutQuadratics } from "./elements";

export * from "./elements";
export * from "./primitives";
export * from "./commands";
export * from "./style";
export { parseCSSColor } from "csscolorparser-ts";

export const parse: (string: string) => SVGRoot = require("svgson").parseSync;

/**
 * Synchronously convert an SVG file string into a data model.
 *
 * @param svg {string}
 * @param options {ConvertOptions}
 */
export function convert(svg: string, options?: {}): SVG;
export function convert(
  svg: string,
  options?: { convertQuadraticsToCubics: true }
): SVGWithoutQuadratics;
export function convert(svg: string, options?: ConvertOptions): SVG {
  const root = parse(svg);
  return convertRoot(root, options);
}
