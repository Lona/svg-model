import camelCase from "lodash.camelcase";
import upperFirst from "lodash.upperfirst";
import { path, style, svg } from "./builders/elements";
import { rect } from "./builders/primitives";
import elementToPath from "./element-to-path";
import { getUnsupportedFeatures } from "./feature-detection";
import { convert as convertPath } from "./path";
import { getHrefNode } from "./traverse";
import { ChildElement, Path, SVG } from "./types/elements";
import { Rect } from "./types/primitives";
import {
  SVGBaseAttributes,
  SVGChildNode,
  SVGDrawableNode,
  SVGPath,
  SVGPathAttributes,
  SVGPathConvertibleNode,
  SVGRoot,
  SVGUnknown,
} from "./types/svg";

type Helpers = {
  getHrefNode: (id: string) => SVGPathConvertibleNode | undefined;
};

function joinTransforms(...transforms: (string | undefined)[]) {
  return transforms.filter((x) => !!x).join(" ");
}

function mergeContexts<T extends SVGBaseAttributes>(
  parentContext: SVGBaseAttributes,
  context: T
): T {
  return {
    ...parentContext,
    ...context,
    transform: joinTransforms(context.transform, parentContext.transform),
  };
}

function convertToSVGPath(child: SVGPathConvertibleNode): SVGPath {
  const createPathNode = (attributes: SVGPathAttributes): SVGPath => {
    return {
      type: "element",
      name: "path",
      attributes,
    };
  };

  switch (child.name) {
    case "path": {
      return createPathNode(child.attributes);
    }
    case "polyline":
    case "polygon": {
      const { points, ...rest } = child.attributes;
      const path = elementToPath(child);
      return createPathNode({ d: path, ...rest });
    }
    case "circle": {
      const { cx, cy, r, ...rest } = child.attributes;
      const path = elementToPath(child);
      return createPathNode({ d: path, ...rest });
    }
    case "rect": {
      const { x, y, width, height, rx, ry, ...rest } = child.attributes;
      const path = elementToPath(child);
      return createPathNode({ d: path, ...rest });
    }
  }
}

function createPathElement(
  attributes: SVGPathAttributes,
  context: SVGBaseAttributes
): Path {
  const { d } = attributes;

  const {
    fill,
    ["fill-opacity"]: fillOpacity,
    stroke,
    ["stroke-opacity"]: strokeOpacity,
    ["stroke-width"]: strokeWidth,
    ["stroke-linecap"]: strokeLineCap,
  } = { ...context, ...attributes };

  return path(
    style({
      fill,
      fillOpacity,
      stroke,
      strokeWidth: strokeWidth != null ? parseFloat(strokeWidth) : undefined,
      strokeLineCap,
      strokeOpacity,
    }),
    convertPath(d, joinTransforms(context.transform, attributes.transform))
  );
}

// Convert all svg nodes into a simplified JSON structure.
// Currently, all drawing nodes (rect, circle, polyline) are converted
// to <path> nodes for simpler rendering.
function convertDrawableNode(
  child: SVGDrawableNode | SVGUnknown,
  context: SVGBaseAttributes,
  definitions: Helpers
): ChildElement | null {
  switch (child.name) {
    case "path":
    case "polyline":
    case "polygon":
    case "circle":
    case "rect": {
      const pathNode = convertToSVGPath(child);
      return createPathElement(pathNode.attributes, context);
    }
    case "use": {
      // Only a handful of attributes (x, y, width, height, href) will override those
      // on the original element definition. All others are applied only if the original
      // element doesn't define them.
      const { href, "xlink:href": xlinkHref, ...rest } = child.attributes;
      const ref = (href ?? xlinkHref)?.slice(1);

      if (!ref) {
        console.error("<use> tag must have either href or xlink:href");
        return null;
      }

      const definition = definitions.getHrefNode(ref);

      if (!definition) {
        console.error(
          `Could not find element referenced by <use> tag: "${ref}"`
        );
        return null;
      }

      const pathNode = convertToSVGPath(definition);
      return createPathElement(
        pathNode.attributes,
        mergeContexts(context, rest)
      );
    }
    default:
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

type ConvertedNode = { element: ChildElement; path: string[] };

/**
 * Convert all children, filtering out groups and adding the "element path",
 * which is ultimately used as the variable name, to each node
 */
function convertNodes(
  nodes: SVGChildNode[],
  parentPath: string[],
  context: SVGBaseAttributes,
  definitions: Helpers
): ConvertedNode[] {
  return nodes.reduce(
    (acc: ConvertedNode[], node: SVGChildNode, index: number) => {
      const attributes = "attributes" in node ? node.attributes : null;
      const name = generateName(attributes, node.name, index);
      const path = [...parentPath, name];

      if (node.name === "g") {
        const childContext = mergeContexts(context, node.attributes);

        return [
          ...acc,
          ...convertNodes(node.children, path, childContext, definitions),
        ];
      } else if (
        node.name === "desc" ||
        node.name === "title" ||
        node.name === "defs" ||
        node.name === "mask"
      ) {
        return acc;
      } else {
        const element = convertDrawableNode(node, context, definitions);

        if (element) {
          return [...acc, { element, path }];
        } else {
          return acc;
        }
      }
    },
    []
  );
}

// Any node with a unique ID can be referenced in logic by that id.
// If an ID isn't unique, then we use the full element path.
export function assignUniqueIds(converted: ConvertedNode[]) {
  const getShortId = (node: ConvertedNode): string =>
    camelCase(node.path[node.path.length - 1]);

  const names = converted.map(getShortId);

  converted.forEach((node) => {
    const name = getShortId(node);

    // Only use this short name if it's unique
    if (names.filter((x) => x === name).length == 1) {
      node.element.id = name;
    } else {
      node.element.id = node.path.join(".");
    }
  });

  return converted;
}

function parseViewBox(viewBox: string): Rect {
  const [vx, vy, vw, vh] = viewBox.split(" ").map(parseFloat);
  return rect(vx, vy, vw, vh);
}

export function convertRoot(root: SVGRoot): SVG {
  const { viewBox } = root.attributes;
  const unsupportedFeatures = getUnsupportedFeatures(root);

  const rootElement = svg(
    viewBox ? parseViewBox(viewBox) : undefined,
    unsupportedFeatures
  );

  const convertedNodes = convertNodes(
    root.children,
    [],
    {},
    {
      getHrefNode: getHrefNode.bind(null, root),
    }
  );

  assignUniqueIds(convertedNodes);

  rootElement.children = convertedNodes.map((node) => node.element);

  return rootElement;
}
