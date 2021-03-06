import { parseCSSColor } from "csscolorparser-ts";
import { Style, style } from "../index";

const svgDefaults: Style = {
  fill: "black",
  fillRule: "nonzero",
  stroke: undefined,
  strokeWidth: 1,
  strokeLineCap: "butt",
};

describe("Style", () => {
  it(`applies SVG default values`, () => {
    const result: Style = style();

    return expect(result).toEqual(svgDefaults);
  });

  it(`erases "none" color values`, () => {
    const result: Style = style({ fill: "none", stroke: "none" });

    return expect(result).toEqual({
      fillRule: "nonzero",
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

  describe("parseCSSColor", () => {
    it(`parses standard colors`, () => {
      return expect(parseCSSColor("red")).toEqual([255, 0, 0, 1]);
    });

    it(`ignores "none" color`, () => {
      return expect(parseCSSColor("none")).toEqual(null);
    });

    it(`ignores invalid colors`, () => {
      return expect(parseCSSColor("url(#gradient)")).toEqual(null);
    });
  });
});
