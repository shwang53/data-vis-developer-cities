"use strict";

const webpack = require("webpack");
const path = require("path");
const copy = require("copy-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, "dist");
const APP_DIR = path.resolve(__dirname, "src");

const config = {
  mode: "development",

  entry: {
    app: [APP_DIR + "/index.js"],
  },

  output: {
    path: BUILD_DIR,
    filename: "bundle.js",
  },

  context: path.join(__dirname, "src"),

  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: [/node_modules/],
        include: APP_DIR,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        // the order of the following loaders is important
        loaders: [
          "style-loader",
          "css-loader?-url",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.scss$/,
        // the order of the following loaders is important
        loaders: [
          "style-loader",
          "css-loader?-url",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.html$/,
        loaders: ["raw-loader"],
      },
    ],
  },

  plugins: [
    new copy(
      [
        { from: APP_DIR + "/html/", to: BUILD_DIR },
        { from: APP_DIR + "/assets/", to: BUILD_DIR + "/assets/" },
        { from: APP_DIR + "/data/", to: BUILD_DIR + "/data/" },
        { from: APP_DIR + "/scripts/", to: BUILD_DIR + "/scripts/" },
        { from: APP_DIR, to: BUILD_DIR },
      ],
      {
        copyUnmodified: false,
        debug: "debug",
      }
    ),
  ],
};

module.exports = config;
