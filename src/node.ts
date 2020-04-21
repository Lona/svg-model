import { rect } from "./builders/primitives";
import { Path, Element, ChildElement } from "./types/elements";
import { path, style, svg } from "./builders/elements";
import {
  SVGBaseAttributes,
  SVGPathAttributes,
  SVGNode,
  SVGParentNode,
  SVGDrawableNode,
  SVGGroup,
  SVGRoot,
  SVGUnknown,
  SVGChildNode,
} from "./types/svg";
import { convert as convertPath } from "./path";

const elementToPath: (element: SVGNode) => string = require("element-to-path");

const camelCase = require("lodash.camelcase");
const upperFirst = require("lodash.upperfirst");

function joinTransforms(...transforms: (string | undefined)[]) {
  return transforms.filter((x) => !!x).join(" ");
}

function createPathElement(
  attributes: SVGPathAttributes,
  context: SVGBaseAttributes
): Path {
  const { d } = attributes;

  const {
    fill,
    stroke,
    ["stroke-opacity"]: strokeOpacity = 1,
    ["stroke-width"]: strokeWidth,
    ["stroke-linecap"]: strokeLineCap,
  } = { ...context, ...attributes };

  return path(
    style(
      fill,
      stroke,
      strokeWidth != null ? parseFloat(strokeWidth) : undefined,
      strokeLineCap,
      strokeOpacity
    ),
    convertPath(d, joinTransforms(context.transform, attributes.transform))
  );
}

function getContext(
  node: SVGGroup,
  context: SVGBaseAttributes
): SVGBaseAttributes {
  return {
    ...context,
    ...node.attributes,
    transform: joinTransforms(context.transform, node.attributes.transform),
  };
}

// Convert all svg nodes into a simplified JSON structure.
// Currently, all drawing nodes (rect, circle, polyline) are converted
// to <path> nodes for simpler rendering.
function convertDrawableNode(
  child: SVGDrawableNode | SVGUnknown,
  context: SVGBaseAttributes
): ChildElement | null {
  switch (child.name) {
    case "path": {
      return createPathElement(child.attributes, context);
    }
    case "polyline":
    case "polygon": {
      const { points, ...rest } = child.attributes;
      const path = elementToPath(child);
      return createPathElement({ d: path, ...rest }, context);
    }
    case "circle": {
      const { cx, cy, r, ...rest } = child.attributes;
      const path = elementToPath(child);
      return createPathElement({ d: path, ...rest }, context);
    }
    case "rect": {
      const { x, y, width, height, rx, ry, ...rest } = child.attributes;
      const path = elementToPath(child);
      return createPathElement({ d: path, ...rest }, context);
    }
    default:
      console.log("Unused svg", child["type"], child["name"]);
      return null;
  }
}

/**
 * Generate a name for an SVG element
 *
 * @param elementName The name of the element's type, e.g. circle
 * @param attributes The elements attributes, potentially containing an id
 * @param index The index of the element within its parent
 */
function generateName(
  attributes: SVGBaseAttributes | null,
  elementName: string,
  index: number
): string {
  return (
    (attributes && upperFirst(camelCase(attributes.id))) ||
    elementName + index.toString()
  );
}

/**
 * Convert all children, filtering out groups and adding the "element path",
 * which is ultimately used as the variable name, to each node
 */
function convertNodes(
  nodes: SVGChildNode[],
  parentPath: string[],
  context: SVGBaseAttributes
): ChildElement[] {
  return nodes.reduce(
    (acc: ChildElement[], node: SVGChildNode, index: number) => {
      const attributes = "attributes" in node ? node.attributes : null;
      const name = generateName(attributes, node.name, index);
      const path = [...parentPath, name];

      if (node.name === "g") {
        const childContext = getContext(node, context);

        return [...acc, ...convertNodes(node.children, path, childContext)];
      } else if (node.name === "desc" || node.name === "title") {
        return acc;
      } else {
        const element = convertDrawableNode(node, context);

        if (element) {
          element.path = path;
          return [...acc, element];
        } else {
          return acc;
        }
      }
    },
    []
  );
}

export function convertRoot(node: SVGRoot): Element | null {
  const { viewBox } = node.attributes;
  const [vx, vy, vw, vh] = viewBox.split(" ").map(parseFloat);
  const element = svg(rect(vx, vy, vw, vh));

  element.data.children = convertNodes(node.children, [], {});

  return element;
}
