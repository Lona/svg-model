import { Command } from "./commands";
import { SVG } from "./elements";
import { Point } from "./primitives";

const round = (number: number, precision: number): number => {
  const base = Math.pow(10, precision);
  return Math.round((number + Number.EPSILON) * base) / base;
};

const stringifyPoint = (point: Point): string =>
  [round(point.x, 3), round(point.y, 3)].join(",");

const stringifyCommand = (command: Command) => {
  switch (command.type) {
    case "close":
      return "Z";
    case "move":
      return `M${stringifyPoint(command.to)}`;
    case "line":
      return `L${stringifyPoint(command.to)}`;
    case "quadCurve": {
      const parameters = [command.controlPoint, command.to].map(stringifyPoint);
      return `Q${parameters.join(" ")}`;
    }
    case "cubicCurve": {
      const parameters = [
        command.controlPoint1,
        command.controlPoint2,
        command.to,
      ].map(stringifyPoint);
      return `C${parameters.join(" ")}`;
    }
  }
};

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
      const { commands, style } = path;

      return {
        name: "path",
        attributes: {
          fill: style.fill ?? "none",
          ...(style.stroke && { stroke: style.stroke }),
          ...(style.strokeWidth !== 1 && {
            "stroke-width": style.strokeWidth.toString(),
          }),
          ...(style.strokeLineCap && { "stroke-linecap": style.strokeLineCap }),
          d: commands.map(stringifyCommand).join(" "),
        },
        children: [],
      };
    }),
  };

  return `<?xml version="1.0" encoding="UTF-8"?>\n${stringifyXMLElement(root)}`;
}
