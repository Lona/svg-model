import { SVGNode } from "./types/svg";

export default function elementToPath(element: SVGNode): string {
  const obj = require("element-to-path");
  const fn = obj && obj.__esModule ? obj["default"] : obj;
  return fn(element);
}
