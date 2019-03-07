const fs = require("fs");
const path = require("path");
const convert = require("../index");

const checkCircleString = fs.readFileSync(
  path.join(__dirname, "../test/assets/check-circle.svg"),
  "utf8"
);

const toggleString = fs.readFileSync(
  path.join(__dirname, "../test/assets/toggle.svg"),
  "utf8"
);

const toggleVerticalString = fs.readFileSync(
  path.join(__dirname, "../test/assets/toggle-vertical.svg"),
  "utf8"
);

describe("index", () => {
  beforeEach(() => {});

  it("converts check-circle.svg", () => {
    return convert(checkCircleString).then(model => {
      expect(model).toMatchSnapshot();
    });
  });

  it("converts toggle.svg", () => {
    return convert(toggleString).then(model => {
      expect(model).toMatchSnapshot();
    });
  });

  it("converts toggle-vertical.svg", () => {
    return convert(toggleVerticalString).then(model => {
      expect(model).toMatchSnapshot();
    });
  });
});
