const fs = require("fs");
const convert = require("./index");

const [, , filename] = process.argv;

if (!filename) {
  console.log("No filename given");
  process.exit(1);
}

const svgString = fs.readFileSync(filename, "utf8");

convert(svgString).then(model => console.log(model));
