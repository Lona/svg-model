const svgson = require("svgson-next").default;
const svgpath = require("svgpath");
const transformParser = require("svg-transform-parser").parse;
const parseCSSColor = require("csscolorparser").parseCSSColor;
const camelCase = require("lodash.camelcase");
const upperFirst = require("lodash.upperfirst");

const BEZIER_CIRCLE_CONTROL = 0.552284749831;

const Path = {
  lerp: (v0, v1, t) => {
    return (1 - t) * v0 + t * v1;
  },

  fromPoints: pointsString => {
    const points = pointsString.split(" ").reduce((acc, item, index) => {
      if (index % 2 === 0) {
        return [...acc, { x: item }];
      } else {
        acc[acc.length - 1].y = item;
        return acc;
      }
    }, []);

    let path = points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
      .join("");

    return path;
  },

  circularCurveXFirst: (from, to) => {
    const control = BEZIER_CIRCLE_CONTROL;
    const control1 = `${Path.lerp(from.x, to.x, control)} ${from.y}`;
    const control2 = `${to.x} ${Path.lerp(to.y, from.y, control)}`;
    const endPoint = `${to.x} ${to.y}`;
    return `C${control1} ${control2} ${endPoint}`;
  },

  circularCurveYFirst(from, to) {
    const control = BEZIER_CIRCLE_CONTROL;
    const control1 = `${from.x} ${Path.lerp(from.y, to.y, control)}`;
    const control2 = `${Path.lerp(to.x, from.x, control)} ${to.y}`;
    const endPoint = `${to.x} ${to.y}`;
    return `C${control1} ${control2} ${endPoint}`;
  },

  generateRect: (x, y, width, height, rx, ry) => {
    const path = [
      `M${x + rx} ${y}`,
      `L${x + width - rx} ${y}`,
      Path.circularCurveXFirst(
        { x: x + width - rx, y },
        { x: x + width, y: y + ry }
      ),
      `L${x + width} ${y + height - ry}`,
      Path.circularCurveYFirst(
        { x: x + width, y: y + height - ry },
        { x: x + width - rx, y: y + height }
      ),
      `L${x + rx} ${y + height}`,
      Path.circularCurveXFirst(
        { x: x + rx, y: y + height },
        { x: x, y: y + height - ry }
      ),
      `L${x} ${y + ry}`,
      Path.circularCurveYFirst({ x: x, y: y + ry }, { x: x + rx, y: y }),
      `Z`
    ].join("");

    return path;
  }
};

function applyOpacity(color, opacity) {
  const [r, g, b, a] = parseCSSColor(color);

  if (opacity >= 1) return color;

  return `rgba(${r},${g},${b},${a * opacity})`;
}

const Builders = {
  point: (x, y) => ({ x, y }),
  rect: (x, y, width, height) => ({ x, y, width, height }),
  style: (fill, stroke, strokeWidth, strokeLineCap, strokeOpacity) => ({
    ...(fill !== "none" && { fill: fill || "black" }),
    ...(stroke &&
      stroke !== "none" && { stroke: applyOpacity(stroke, strokeOpacity) }),
    strokeWidth: strokeWidth != null ? strokeWidth : 1,
    strokeLineCap: strokeLineCap || "butt"
  }),

  circle: (style, center, radius) => ({
    type: "circle",
    data: {
      params: {
        center,
        radius,
        style
      }
    }
  }),
  path: (style, commands) => ({
    type: "path",
    data: {
      params: {
        commands,
        style
      }
    }
  }),
  svg: viewBox => ({
    type: "svg",
    data: {
      params: {
        ...(viewBox && { viewBox })
      }
    }
  }),

  Path: {
    move: to => ({ type: "move", data: { to } }),
    line: to => ({ type: "line", data: { to } }),
    quadCurve: (to, controlPoint) => ({
      type: "quadCurve",
      data: {
        to,
        controlPoint
      }
    }),
    cubicCurve: (to, controlPoint1, controlPoint2) => ({
      type: "cubicCurve",
      data: {
        to,
        controlPoint1,
        controlPoint2
      }
    }),
    close: () => ({ type: "close" })
  }
};

function convertPathCommand(segment, index, x, y) {
  const [command, ...parameters] = segment;

  switch (command) {
    case "M": {
      const [x, y] = parameters;
      return Builders.Path.move(Builders.point(x, y));
    }
    case "L": {
      const [x, y] = parameters;
      return Builders.Path.line(Builders.point(x, y));
    }
    case "H": {
      const [x] = parameters;
      return Builders.Path.line(Builders.point(x, y));
    }
    case "V": {
      const [y] = parameters;
      return Builders.Path.line(Builders.point(x, y));
    }
    case "Z": {
      return Builders.Path.close();
    }
    case "Q": {
      let [qx1, qy1, qx2, qy2] = parameters;

      return Builders.Path.quadCurve(
        Builders.point(qx2, qy2),
        Builders.point(qx1, qy1)
      );
    }
    case "C": {
      const [x1, y1, x2, y2, x3, y3] = parameters;

      return Builders.Path.cubicCurve(
        Builders.point(x3, y3),
        Builders.point(x1, y1),
        Builders.point(x2, y2)
      );
    }
    default:
      console.log("Path segment not used:", segment);
      return null;
  }
}

function convertPath(string, transform) {
  const parsed = svgpath(string);

  parsed.unarc();
  parsed.unshort();
  parsed.abs();

  if (transform) {
    parsed.transform(transform);
  }

  const drawCommands = [];

  parsed.iterate((...args) => {
    const command = convertPathCommand(...args);

    if (!command) return;

    drawCommands.push(command);
  });

  return drawCommands;
}

function numberValue(value, defaultValue = 0) {
  if (typeof value === "string") {
    return parseFloat(value);
  } else if (value == null) {
    return defaultValue;
  }
  return value;
}

function joinTransforms(...transforms) {
  return transforms.filter(x => !!x).join(" ");
}

// Convert all svg nodes into a simplified JSON structure.
// Currently, all drawing nodes (rect, circle, polyline) are converted
// to <path> nodes for simpler rendering.
function convertChild(child, index, context) {
  const { type, name, attributes, children } = child;

  switch (name) {
    case "title":
    case "desc":
      return null;
    case "svg": {
      const { viewBox } = attributes;

      const [vx, vy, vw, vh] = viewBox.split(" ").map(parseFloat);

      return Builders.svg(Builders.rect(vx, vy, vw, vh));
    }
    case "path": {
      const { d } = attributes;

      const {
        fill,
        stroke,
        ["stroke-opacity"]: strokeOpacity,
        ["stroke-width"]: strokeWidth,
        ["stroke-linecap"]: strokeLineCap
      } = { ...context, ...attributes };

      return Builders.path(
        Builders.style(
          fill,
          stroke,
          strokeWidth != null ? parseFloat(strokeWidth) : undefined,
          strokeLineCap,
          numberValue(strokeOpacity, 1)
        ),
        convertPath(d, joinTransforms(context.transform, attributes.transform))
      );
    }
    case "polyline": {
      const { points } = attributes;

      const path = Path.fromPoints(points);

      return convertChild(
        { name: "path", attributes: { d: path, ...attributes } },
        index,
        context
      );
    }
    case "polygon": {
      const { points } = attributes;

      const path = Path.fromPoints(points) + "Z";

      return convertChild(
        { name: "path", attributes: { d: path, ...attributes } },
        index,
        context
      );
    }
    case "circle": {
      const { cx: rawCx, cy: rawCy, r: rawR } = attributes;

      let [cx, cy, r] = [rawCx, rawCy, rawR].map(value =>
        numberValue(value, 0)
      );

      const path = Path.generateRect(cx - r, cy - r, r * 2, r * 2, r, r);

      return convertChild(
        { name: "path", attributes: { d: path, ...attributes } },
        index,
        context
      );
    }
    case "rect": {
      const {
        x: rawX,
        y: rawY,
        width: rawWidth,
        height: rawHeight,
        rx: rawRx,
        ry: rawRy
      } = attributes;

      let [x, y, width, height, rx, ry] = [
        rawX,
        rawY,
        rawWidth,
        rawHeight,
        rawRx,
        rawRy
      ].map(value => numberValue(value, 0));

      if ("ry" in attributes && !("rx" in attributes)) {
        rx = ry;
      } else if ("rx" in attributes && !("ry" in attributes)) {
        ry = rx;
      }

      const path = Path.generateRect(x, y, width, height, rx, ry);

      return convertChild(
        { name: "path", attributes: { d: path, ...attributes } },
        index,
        context
      );
    }
    case "g": {
      const transform = joinTransforms(context.transform, attributes.transform);

      return {
        type: "group",
        context: { ...context, ...attributes, transform }
      };
    }
    default:
      console.log("Unused svg", type, name);
      return;
  }
}

// Convert all children, filtering out groups and the "element path", which
// is ultimately used as the variable name, to each node
function convertChildren(children, parentElementPath, context) {
  return children.reduce((acc, child, index) => {
    const name =
      (child.attributes && upperFirst(camelCase(child.attributes.id))) ||
      child.name + index.toString();

    const converted = convertNode(child, [...parentElementPath, name], context);

    if (!converted) return acc;

    if (converted.type === "group") {
      return [...acc, ...converted.data.children];
    }

    return [...acc, converted];
  }, []);
}

function convertNode(node, elementPath = [], context = {}) {
  const { children } = node;

  const converted = convertChild(node, elementPath, context);

  if (!converted) return null;

  return Object.assign({}, converted, {
    data: {
      ...converted.data,
      elementPath,
      ...(children && {
        children: convertChildren(
          children,
          elementPath,
          converted.context || context
        )
      })
    }
  });
}

// Any node with a unique ID can be referenced in logic by that id.
// If an ID isn't unique, then we use the full element path.
function simplifyNames(node) {
  function flatten(node, acc = []) {
    acc.push(node);

    if (node.data.children) {
      node.data.children.forEach(child => flatten(child, acc));
    }

    return acc;
  }

  const nodes = flatten(node);

  const names = nodes
    .filter(node => node.data.elementPath && node.data.elementPath.length > 0)
    .map(node =>
      camelCase(node.data.elementPath[node.data.elementPath.length - 1])
    );

  nodes
    .filter(node => node.data.elementPath && node.data.elementPath.length > 0)
    .forEach(node => {
      const name = camelCase(
        node.data.elementPath[node.data.elementPath.length - 1]
      );

      if (names.filter(x => x === name).length == 1) {
        node.data.elementPath = [name];
      }
    });

  return node;
}

function convert(data) {
  return svgson(data).then(parsed => {
    let node = convertNode(parsed);
    node = simplifyNames(node);
    return node;
  });
}

module.exports = convert;
