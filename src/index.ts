import { convertRoot } from "./node";
import { SVGRoot } from "./types/svg";

const parseSync: (string: string) => SVGRoot = require("svgson").parseSync;

export default function convert(data: string) {
  const parsed = parseSync(data);
  return convertRoot(parsed);
}
