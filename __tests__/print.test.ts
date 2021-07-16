import fs from "fs";
import path from "path";
import { convertSync } from "../src";
import { printSVG } from "../src/print";

const readAsset = (name: string) => {
  const assetPath = path.join(__dirname, "../test/assets", name);
  return fs.readFileSync(assetPath, "utf8");
};

test("prints svg", () => {
  const asset = readAsset("check-circle.svg");
  const converted = convertSync(asset);
  const svg = printSVG(converted);
  expect(svg).toMatchSnapshot();
});

test("prints svg with quadratics", () => {
  const asset = readAsset("quadratics.svg");
  const converted = convertSync(asset);
  const svg = printSVG(converted);
  expect(svg).toMatchSnapshot();
});

test("prints svg without quadratics", () => {
  const asset = readAsset("quadratics.svg");
  const converted = convertSync(asset, {
    convertQuadraticsToCubics: true,
  });
  const svg = printSVG(converted);
  expect(svg).toMatchSnapshot();
});