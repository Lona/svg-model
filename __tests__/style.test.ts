import { style } from "../src/builders/elements";
import { Style } from "../src";

const svgDefaults: Style = {
  strokeWidth: 1,
  strokeLineCap: "butt",
  fill: "black",
  stroke: undefined,
};

describe("Style", () => {
  it(`applies SVG default values`, () => {
    const result: Style = style();

    return expect(result).toEqual(svgDefaults);
  });

  it(`erases "none" color values`, () => {
    const result: Style = style({ fill: "none", stroke: "none" });

    return expect(result).toEqual({
      strokeWidth: 1,
      strokeLineCap: "butt",
    });
  });

  it(`applies fill and stroke opacity`, () => {
    const result: Style = style({
      fill: "red",
      fillOpacity: 0.5,
      stroke: "red",
      strokeOpacity: 0.5,
    });

    return expect(result).toEqual({
      ...svgDefaults,
      fill: "rgba(255,0,0,0.5)",
      stroke: "rgba(255,0,0,0.5)",
    });
  });

  it(`ignores fill and stroke opacity of 1`, () => {
    const result: Style = style({
      fill: "red",
      fillOpacity: 1,
      stroke: "red",
      strokeOpacity: 1,
    });

    return expect(result).toEqual({
      ...svgDefaults,
      fill: "red",
      stroke: "red",
    });
  });
});
