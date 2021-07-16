import { point } from "./builders/primitives";
import { move, line, close, quadCurve, cubicCurve } from "./builders/commands";
import * as Commands from "./builders/commands";

const svgpath = require("svgpath");

export function convertCommand(segment: any[], x: number, y: number) {
  const command: string = segment[0];
  const parameters: number[] = segment.slice(1);

  switch (command) {
    case "M": {
      const [x, y] = parameters;
      return move(point(x, y));
    }
    case "L": {
      const [x, y] = parameters;
      return line(point(x, y));
    }
    case "H": {
      const [x] = parameters;
      return line(point(x, y));
    }
    case "V": {
      const [y] = parameters;
      return line(point(x, y));
    }
    case "Z": {
      return close();
    }
    case "Q": {
      let [qx1, qy1, qx2, qy2] = parameters;

      return quadCurve(point(qx2, qy2), point(qx1, qy1));
    }
    case "C": {
      const [x1, y1, x2, y2, x3, y3] = parameters;

      return cubicCurve(point(x3, y3), point(x1, y1), point(x2, y2));
    }
    default:
      console.error("Path segment not used:", segment);
      return null;
  }
}

export function convert(string: string, transform: string) {
  const parsed = svgpath(string);

  parsed.unarc();
  parsed.unshort();
  parsed.abs();

  if (transform) {
    parsed.transform(transform);
  }

  const drawCommands: Commands.Command[] = [];

  parsed.iterate((segment: any[], index: number, x: number, y: number) => {
    const command = convertCommand(segment, x, y);

    if (!command) return;

    drawCommands.push(command);
  });

  return drawCommands;
}
