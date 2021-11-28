const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

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
    clean: true,
  },
  devServer: {
    hot: true,
    open: ["/overview.html"],
    static: "./dist",
    compress: false,
    port: 3000,
    allowedHosts: "all",
    client: {
      overlay: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ["csv-loader"],
      },
      {
        test: /\.xml$/i,
        use: ["xml-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "overview.html",
      chunks: ["overview"],
      template: "./src/pages/overview/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "vaccinate.html",
      chunks: ["vaccinate"],
      template: "./src/pages/vaccinate/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "dataTable.html",
      chunks: ["dataTable"],
      template: "./src/pages/dataTable/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "measure.html",
      chunks: ["measure"],
      template: "./src/pages/measure/index.html",
    }),
  ],
};
