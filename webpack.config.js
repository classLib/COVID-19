const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    overview: "./src/pages/overview/index.js",
    vaccinate: "./src/pages/vaccinate/index.js",
    dataTable: "./src/pages/dataTable/index.js",
    measure: "./src/pages/measure/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },
  devServer: {
    hot: true,
    open: ["/dataTable.html"],
    static: "./dist",
    compress: false,
    port: 3000,
    allowedHosts: "all",
    client: {
      overlay: true,
    },
  },
  module: {
    rules: [{
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    }, ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, "./src/assets"),
        to: "./assets",
      }, ],
    }),
    new HtmlWebpackPlugin({
      filename: "overview.html",
      template: "./src/pages/overview/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "vaccinate.html",
      template: "./src/pages/vaccinate/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "dataTable.html",
      template: "./src/pages/dataTable/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "measure.html",
      template: "./src/pages/measure/index.html",
    }),
  ],
};