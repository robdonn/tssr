const express = require("express");
const fsX = require("fs-extra");
const nodemon = require("nodemon");
const webpack = require("webpack");

const paths = require("./paths");

class WebpackSSRDevServer {
  constructor(config = {}) {
    this.config = config;
    this.app = express();
    this.paths = paths(config);

    this.ensureRequiredDirs();

    if (this.config.hot) {
      this.enableHotReloading();
    }
  }

  /**
   * Ensures that source directories exist and build directories are empty
   */
  ensureRequiredDirs() {
    if (
      !fsX.existsSync(this.paths.clientSrc) ||
      !fsX.existsSync(this.paths.serverSrc) ||
      !fsX.existsSync(this.paths.commonSrc)
    ) {
      throw new Error("Source directories do not exist.");
    }

    if (
      !fsX.existsSync(this.paths.clientWebpack) ||
      !fsX.existsSync(this.paths.serverWebpack)
    ) {
      throw new Error("Webpack configurations do not exist.");
    }

    this.webpackConfig = {
      client: require(this.paths.clientWebpack),
      server: require(this.paths.serverWebpack)
    };

    fsX.emptyDirSync(this.paths.clientBuild);
    fsX.emptyDirSync(this.paths.serverBuild);
  }

  enableHotReloading() {
    const { entry } = this.webpackConfig.client;
    const hmrEntry = `webpack-hot-middleware/client?path=${
      process.env.WEBPACK_DEVSERVER_HOST
    }:${process.env.WEBPACK_DEVSERVER_PORT}/__webpack_hmr`;

    if (!this.webpackConfig.client.entry) {
      throw new Error("No entry declared in client webpack config");
    }

    const handleArray = entryArray => [hmrEntry, ...entryArray];
    const handleString = entryString => [hmrEntry, entryString];

    if (typeof entry === "object") {
      if (!Array.isArray(entry)) {
        this.webpackConfig.client.entry = Object.entries(entry).reduce(
          (acc, [entryKey, entryValue]) => ({
            ...acc,
            [entryKey]:
              typeof entryValue === "string"
                ? handleString(entryValue)
                : handleArray(entryValue)
          }),
          {}
        );
      } else {
        this.webpackConfig.client.entry = handleArray(entry);
      }
    } else {
      this.webpackConfig.client.entry = handleString(entry);
    }
  }
}

module.exports = WebpackSSRDevServer;
