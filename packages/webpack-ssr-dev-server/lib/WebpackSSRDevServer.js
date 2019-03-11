const express = require("express");
const fsX = require("fs-extra");
const nodemon = require("nodemon");
const webpack = require("webpack");

const paths = require("./paths");

class WebpackSSRDevServer {
  constructor(config) {
    this.config = config;
    this.app = express();
    this.paths = paths(config);

    this.ensureRequiredDirs();
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

    fsX.emptyDirSync(this.paths.clientBuild);
    fsX.emptyDirSync(this.paths.serverBuild);
  }
}

module.exports = WebpackSSRDevServer;
