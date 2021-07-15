import { SVG } from "./types/elements";
import { Point } from "./types/primitives";

const round = (number: number, precision: number): number => {
  const base = Math.pow(10, precision);
  return Math.round((number + Number.EPSILON) * base) / base;
};

const stringifyPoint = (point: Point): string =>
  [round(point.x, 3), round(point.y, 3)].join(",");

type XMLElement = {
  name: string;
  attributes: Record<string, string>;
  children: XMLElement[];
};

function stringifyXMLElement({
  name,
  attributes,
  children,
}: XMLElement): string {
  const openingTagParts = [
    name,
    ...Object.entries(attributes).map(([name, value]) => `${name}="${value}"`),
  ];
  const openingTag = `<${openingTagParts.join(" ")}>`;
  const closingTag = `</${name}>`;

  const childrenString = children
    .map(stringifyXMLElement)
    .map((s) =>
      s
        .split("\n")
        .map((l) => "  " + l)
        .join("\n")
    )
    .join("\n");

  if (!childrenString) {
    return [openingTag, closingTag].join("");
  }

  return [openingTag, childrenString, closingTag].filter((s) => !!s).join("\n");
}

export function printSVG(svg: SVG) {
  const viewBox = svg.params.viewBox;
  const root: XMLElement = {
    name: "svg",
    attributes: {
      ...(viewBox && {
        width: `${viewBox.width}px`,
        height: `${viewBox.height}px`,
        viewBox: [viewBox.x, viewBox.y, viewBox.width, viewBox.height]
          .map((value) => value.toString())
          .join(" "),
      }),
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
    },
    children: svg.children.map((path): XMLElement => {
      const { commands, style } = path.data.params;

      return {
        name: "path",
        attributes: {
          fill: style.fill ?? "none",
          ...(style.stroke && { stroke: style.stroke }),
          ...(style.strokeWidth !== 1 && {
            "stroke-width": style.strokeWidth.toString(),
          }),
          ...(style.strokeLineCap && { "stroke-linecap": style.strokeLineCap }),
          d: commands
            .map((command) => {
              switch (command.type) {
                case "close":
                  return "Z";
                case "move":
                  return `M${stringifyPoint(command.data.to)}`;
                case "line":
                  return `L${stringifyPoint(command.data.to)}`;
                case "quadCurve": {
                  const parameters = [
                    command.data.controlPoint,
                    command.data.to,
                  ].map(stringifyPoint);
                  return `Q${parameters.join(" ")}`;
                }
                case "cubicCurve": {
                  const parameters = [
                    command.data.controlPoint1,
                    command.data.controlPoint2,
                    command.data.to,
                  ].map(stringifyPoint);
                  return `C${parameters.join(" ")}`;
                }
              }
            })
            .join(" "),
        },
        children: [],
      };
    }),
  };
  return `<?xml version="1.0" encoding="UTF-8"?>\n${stringifyXMLElement(root)}`;
}
