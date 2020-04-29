import { traverse } from "./traverse";
import { SVGRoot } from "./types/svg";

/**
 * All supported element names.
 */
export const SUPPORTED_ELEMENT_NAMES = [
  "circle",
  "defs",
  "desc",
  "g",
  "mask",
  "path",
  "polygon",
  "polyline",
  "rect",
  "svg",
  "title",
  "use",
];

/**
 * All supported element attributes.
 *
 * We could be more sophisticated and keep a map of which attributes can exist
 * on which element, but that doesn't seem necessary yet.
 */
export const SUPPORTED_ATTRIBUTE_NAMES = [
  "cx",
  "cy",
  "d",
  "fill-opacity",
  "fill-rule",
  "fill",
  "height",
  "href",
  "id",
  "points",
  "r",
  "rx",
  "ry",
  "stroke-linecap",
  "stroke-opacity",
  "stroke-width",
  "stroke",
  "transform",
  "viewBox",
  "width",
  "x",
  "xlink:href",
  "xmlns",
  "xmlns:xlink",
  "y",
];

function unique<T>(elements: T[]): T[] {
  return Array.from(new Set(elements).values());
}

export function getUnsupportedFeatures(
  root: SVGRoot
): { elements: string[]; attributes: string[] } {
  const elements: string[] = [];
  const attributes: string[] = [];

  traverse(root, (node) => {
    if (SUPPORTED_ELEMENT_NAMES.includes(node.name)) {
      if ("attributes" in node) {
        const attributeKeys = Object.keys(node.attributes);
        attributeKeys.forEach((key) => {
          if (!SUPPORTED_ATTRIBUTE_NAMES.includes(key)) {
            attributes.push(`${node.name}.${key}`);
          }
        });
      }
    } else {
      elements.push(node.name);
    }
  });

  return {
    elements: unique(elements),
    attributes: unique(attributes),
  };
}
