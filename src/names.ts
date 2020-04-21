import { Element } from "./types/elements";

const camelCase = require("lodash.camelcase");

// Any node with a unique ID can be referenced in logic by that id.
// If an ID isn't unique, then we use the full element path.
export function assignUniqueNames(node: Element) {
  function flatten(node: Element, acc: Element[] = []) {
    acc.push(node);

    if ("children" in node.data) {
      node.data.children.forEach((child) => flatten(child, acc));
    }

    return acc;
  }

  const nodes = flatten(node);

  const names = nodes
    .filter((node) => node.path && node.path.length > 0)
    .map((node) => camelCase(node.path[node.path.length - 1]));

  nodes
    .filter((node) => node.path && node.path.length > 0)
    .forEach((node) => {
      const name = camelCase(node.path[node.path.length - 1]);

      if (names.filter((x) => x === name).length == 1) {
        node.path = [name];
      }
    });

  return node;
}
