import * as Commands from "./commands";
import { Rect } from "./primitives";
import { Style } from "./style";

export type Path = {
  id: string;
  commands: Commands.Command[];
  style: Style;
};

export type SVG = {
  children: Path[];
  viewBox?: Rect;
  metadata: {
    unsupportedFeatures: string[];
  };
};

export type CommandWithoutQuadratics = Exclude<
  Commands.Command,
  Commands.QuadCurve
>;

export type PathWithoutQuadratics = Omit<Path, "commands"> & {
  commands: CommandWithoutQuadratics[];
};

export type SVGWithoutQuadratics = Omit<SVG, "children"> & {
  children: PathWithoutQuadratics[];
};

export const path = (style: Style, commands: Commands.Command[]): Path => ({
  id: "",
  commands,
  style,
});

export const svg = (
  viewBox: Rect | undefined,
  unsupportedFeatures: string[]
): SVG => ({
  children: [],
  ...(viewBox && { viewBox }),
  metadata: {
    unsupportedFeatures,
  },
});
