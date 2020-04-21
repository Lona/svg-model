import { convertRoot } from "./node";
import { assignUniqueNames } from "./names";
import { SVGRoot } from "./types/svg";

const parseSync: (string: string) => SVGRoot = require("svgson").parseSync;

export default function convert(data: string) {
  const parsed = parseSync(data);
  let node = convertRoot(parsed);
  node = assignUniqueNames(node!);
  return node;
}
