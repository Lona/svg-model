const { resolve, join } = require("path");
const webpack = require("webpack");

const paths = {
  dist: resolve(__dirname, "dist"),
  lib: resolve(__dirname, "lib"),
};

module.exports = [
  {
    mode: "production",
    entry: join(paths.lib, "index.js"),
    target: "node",
    output: {
      path: paths.dist,
      filename: "svg-model.umd.js",
      library: {
        root: "svgModel",
        amd: "svg-model",
        commonjs: "svg-model",
      },
      libraryTarget: "umd",
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: ["@babel/plugin-proposal-object-rest-spread"],
            },
          },
        },
      ],
    },
  },
];
