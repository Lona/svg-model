export default function parseCSSColor(
  colorString: string
): [number, number, number, number] | undefined {
  if (colorString === "none") return;

  const obj = require("csscolorparser");
  const mod = obj && obj.__esModule ? obj["default"] : obj;

  try {
    return mod.parseCSSColor(colorString) || undefined;
  } catch {
    return;
  }
}
