import { ConvertOptions, convertRoot } from "./node";
import { SVGRoot } from "./types/svg";
import { SVG, SVGWithoutQuadratics } from "./elements";

export * from "./elements";
export * from "./primitives";
export * from "./commands";
export * from "./style";

const parseSync: (string: string) => SVGRoot = require("svgson").parseSync;

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
  const root = parseSync(svg);
  return convertRoot(root, options);
}
