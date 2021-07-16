import { SVGNode } from "./svg-types";

export default function elementToPath(element: SVGNode): string {
  const obj = require("element-to-path");
  const fn = obj && obj.__esModule ? obj["default"] : obj;
  return fn(element);
}
