import fs from "fs";
import path from "path";
import { convert } from "../async";

const names = fs.readdirSync(path.join(__dirname, "../../test/assets"));

const assets = names.map((name) => {
  const assetPath = path.join(__dirname, "../../test/assets", name);
  return { name, data: fs.readFileSync(assetPath, "utf8") };
});

describe("async", () => {
  assets.forEach((asset: { name: string; data: string }) => {
    it(`converts ${asset.name}`, async () => {
      const model = await convert(asset.data);
      return expect(model).toMatchSnapshot();
    });
  });

  it("detects unsupported features", async () => {
    const svg = `<svg width="24px" height="24px" viewBox="0 0 24 24">
    <animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="indefinite" />
  <path d="M0,0 L10,10" clip-path="test" fill="url(#gradient)"></path>
</svg>`;
    const model = await convert(svg);
    expect(model.metadata.unsupportedFeatures).toEqual([
      "animate",
      "path.clip-path",
      "path.fill.url(#gradient)",
    ]);
    return;
  });
});
