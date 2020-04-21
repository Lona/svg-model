import { convertRoot } from "./node";
import { SVGRoot } from "./types/svg";
import { SVG } from "./types/elements";

const parseSync: (string: string) => SVGRoot = require("svgson").parseSync;

export default function convert(data: string): SVG {
  const parsed = parseSync(data);
  return convertRoot(parsed);
}

export * from "./types/elements";
export * from "./types/commands";
export * from "./types/primitives";
