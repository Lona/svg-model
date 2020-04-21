![](./docs/logo.png)

# SVG Model

A simplified model to represent SVGs for drawing on a 2D canvas. This is useful when building an SVG renderer.

## How it works

All SVG elements are converted to a flat list of paths. Group attributes (e.g. styles, transforms) are already applied to each path. Paths are simplified to the minimal set of commands needed for accurate drawing.
