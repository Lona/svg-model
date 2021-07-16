import SVGO from "svgo";
import { SVG, SVGWithoutQuadratics } from "./elements";
import { convert as convertSync } from "./index";
import { ConvertOptions } from "./node";

/**
 * Convert an SVG file string into a data model.
 *
 * @param svg
 * @param options {ConvertOptions}
 */
export async function convert(svg: string, options?: {}): Promise<SVG>;
export async function convert(
  svg: string,
  options?: { convertQuadraticsToCubics: true }
): Promise<SVGWithoutQuadratics>;
export async function convert(
  svg: string,
  options?: ConvertOptions
): Promise<SVG> {
  return convertSync(await optimize(svg), options);
}

async function optimize(svg: string) {
  const svgo = new SVGO({
    plugins: [
      { removeUselessDefs: true },
      { removeViewBox: false },
      { cleanupIDs: false },
      { convertColors: false },
    ],
  });
  const optimized = await svgo.optimize(svg);
  return optimized.data;
}
