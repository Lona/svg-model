const fs = require("fs");
const convert = require("./lib/index.js").default;

const [, , filename] = process.argv;

if (!filename) {
  console.log("No filename given");
  process.exit(1);
}

async function main() {
  const svgString = fs.readFileSync(filename, "utf8");

  const model = await convert(svgString);

  console.log(JSON.stringify(model, null, 2));
}

main();
