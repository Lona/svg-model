import fs from "fs";
import path from "path";
import convert from "../src/index";

const names = fs.readdirSync(path.join(__dirname, "../test/assets"));

const assets = names.map((name) => {
  const assetPath = path.join(__dirname, "../test/assets", name);
  return { name, data: fs.readFileSync(assetPath, "utf8") };
});

describe("index", () => {
  beforeEach(() => {});

  assets.forEach((asset: { name: string; data: string }) => {
    it(`converts ${asset.name}`, () => {
      const model = convert(asset.data);
      return expect(model).toMatchSnapshot();
    });
  });
});
