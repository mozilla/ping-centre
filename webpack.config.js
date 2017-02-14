"use strict";

module.exports = {
  entry: "./src/ping-centre.js",
  output: {
    path: "./dist",
    filename: "ping-centre.min.js",
    library: "PingCentre"
  },
  module: {
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {presets: ["es2015"]}
    }]
  }
};
