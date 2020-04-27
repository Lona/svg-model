import { SVGNode, SVGRoot, SVGPathConvertibleNode } from "./types/svg";

export function traverse(root: SVGNode, f: (node: SVGNode) => void) {
  f(root);

  if ("children" in root && Array.isArray(root.children)) {
    root.children.forEach((child) => traverse(child, f));
  }
}

export function getDefinition(root: SVGRoot, id: string): SVGNode | undefined {
  let found;
  traverse(root, (node) => {
    if ("attributes" in node && node.attributes.id === id) {
      found = node;
    }
  });
  return found;
}

export function getHrefNode(
  root: SVGRoot,
  id: string
): SVGPathConvertibleNode | undefined {
  const node = getDefinition(root, id);

  if (
    node &&
    (node.name === "rect" ||
      node.name === "circle" ||
      node.name === "polyline" ||
      node.name === "polygon" ||
      node.name === "path")
  ) {
    return node;
  }

  return undefined;
}
