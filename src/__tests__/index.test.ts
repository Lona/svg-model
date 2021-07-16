import fs from "fs";
import path from "path";
import { convert } from "../index";

const names = fs.readdirSync(path.join(__dirname, "assets"));

const assets = names.map((name) => {
  const assetPath = path.join(__dirname, "assets", name);
  return { name, data: fs.readFileSync(assetPath, "utf8") };
});

describe("convert", () => {
  assets.forEach((asset: { name: string; data: string }) => {
    it(`converts ${asset.name}`, () => {
      const model = convert(asset.data);
      expect(model).toMatchSnapshot();
    });
  });
});
