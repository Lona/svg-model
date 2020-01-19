const fs = require("fs");
const path = require("path");
const convert = require("../index");

describe("index", () => {
  beforeEach(() => {});

  fs.readdirSync(path.join(__dirname, "../test/assets")).forEach(filepath => {
    it(`converts ${filepath}`, () => {
      const svgString = fs.readFileSync(
        path.join(__dirname, "../test/assets", filepath),
        "utf8"
      );
      const model = convert(svgString);
      return expect(model).toMatchSnapshot();
    });
  });
});
