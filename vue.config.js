var CopyPlugin = require("copy-webpack-plugin");
var path = require("path");
module.exports = {
  transpileDependencies: ["vuex-module-decorators", "vuetify"],
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, "node_modules", "itk", "WebWorkers"),
            to: path.join(__dirname, "dist", "itk", "WebWorkers")
          },
          {
            from: path.join(__dirname, "node_modules", "itk", "ImageIOs"),
            to: path.join(__dirname, "dist", "itk", "ImageIOs")
          },
          {
            from: path.join(__dirname, "node_modules", "itk", "PolyDataIOs"),
            to: path.join(__dirname, "dist", "itk", "PolyDataIOs")
          },
          {
            from: path.join(__dirname, "node_modules", "itk", "MeshIOs"),
            to: path.join(__dirname, "dist", "itk", "MeshIOs")
          },
          {
            from: path.join(
              __dirname,
              "itk",
              "web-build",
              "MaxInRegion",
              "MaxInRegion.js"
            ),
            to: path.join(
              __dirname,
              "dist",
              "itk",
              "Pipelines",
              "MaxInRegion.js"
            )
          },
          {
            from: path.join(
              __dirname,
              "itk",
              "web-build",
              "MaxInRegion",
              "MaxInRegionWasm.js"
            ),
            to: path.join(
              __dirname,
              "dist",
              "itk",
              "Pipelines",
              "MaxInRegionWasm.js"
            )
          },
          {
            from: path.join(
              __dirname,
              "itk",
              "web-build",
              "MaxInRegion",
              "MaxInRegionWasm.wasm"
            ),
            to: path.join(
              __dirname,
              "dist",
              "itk",
              "Pipelines",
              "MaxInRegionWasm.wasm"
            )
          }
        ]
      })
    ]
    // resolve: {
    //   alias: {
    //     moment: "moment/src/moment"
    //   }
    // }
  },
  devServer: {
    host: "0.0.0.0",
    hot: true,
    disableHostCheck: true
  }
};
