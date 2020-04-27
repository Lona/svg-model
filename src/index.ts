import { convertRoot } from "./node";
import { SVGRoot } from "./types/svg";
import { SVG } from "./types/elements";
import SVGO from "svgo";

const parseSync: (string: string) => SVGRoot = require("svgson").parseSync;

/**
 * Synchronously convert an SVG file string into a data model.
 *
 * Many optimizations can't be performed, since we can't run `svgo` synchronously.
 *
 * @param data {string}
 */
export function convertSync(data: string): SVG {
  const root = parseSync(data);
  return convertRoot(root);
}

/**
 * Convert an SVG file string into a data model.
 *
 * @param data
 */
export async function convert(data: string): Promise<SVG> {
  const svgo = new SVGO({
    plugins: [
      { removeUselessDefs: true },
      { removeViewBox: false },
      { cleanupIDs: false },
      { convertColors: false },
    ],
  });
  const optimized = await svgo.optimize(data);
  const root = parseSync(optimized.data);
  return convertRoot(root);
}

export * from "./types/elements";
export * from "./types/commands";
export * from "./types/primitives";
