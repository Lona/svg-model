import { convert as convertNode } from "./node";
import { assignUniqueNames } from "./names";
import { SVGNode } from "./types/svg";

const parseSync: (string: string) => SVGNode = require("svgson").parseSync;

export default function convert(data: string) {
  const parsed = parseSync(data);
  let node = convertNode(parsed);
  node = assignUniqueNames(node!);
  return node;
}
