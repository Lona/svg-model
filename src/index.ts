import { ConvertOptions, convertRoot } from "./node";
import { SVGRoot } from "./types/svg";
import { SVG } from "./elements";
import SVGO from "svgo";

const parseSync: (string: string) => SVGRoot = require("svgson").parseSync;

/**
 * Synchronously convert an SVG file string into a data model.
 *
 * Many optimizations can't be performed, since we can't run `svgo` synchronously.
 *
 * @param svg {string}
 * @param options {ConvertOptions}
 */
export function convertSync(svg: string, options?: ConvertOptions): SVG {
  const root = parseSync(svg);
  return convertRoot(root, options);
}

/**
 * Convert an SVG file string into a data model.
 *
 * If running in node, we first optimize the SVG using SVGO.
 *
 * @param svg
 * @param options {ConvertOptions}
 */
export async function convert(
  svg: string,
  options?: ConvertOptions
): Promise<SVG> {
  if (process.env.PLATFORM === "web") {
    return convertSync(svg, options);
  }

  const svgo = new SVGO({
    plugins: [
      { removeUselessDefs: true },
      { removeViewBox: false },
      { cleanupIDs: false },
      { convertColors: false },
    ],
  });
  const optimized = await svgo.optimize(svg);
  const root = parseSync(optimized.data);
  return convertRoot(root, options);
}

export * from "./elements";
export * from "./primitives";
export * from "./commands";
