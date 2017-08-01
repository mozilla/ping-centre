"use strict";

const webpack = require("webpack");

module.exports = {
  entry: "./src/ping-centre.js",
  output: {
    path: __dirname + "/dist",
    filename: "ping-centre.addon.min.js",
    libraryTarget: "commonjs2",
    library: "PingCentre"
  },
  module: {
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {presets: ["es2015"]}
    }]
  },
  plugins: [
    new webpack.BannerPlugin({banner: "var platform_require = require;\n", raw: true})
  ]
};
