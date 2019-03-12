const express = require("express");

const paths = require("./paths");
const { ensureRequiredDirs } = require("./methods/ensureRequiredDirs");
const { enableHotReloading } = require("./methods/enableHotReloading");

class WebpackSSRDevServer {
  constructor(config = {}) {
    this.config = config;
    this.app = express();
    this.paths = paths(config);

    ensureRequiredDirs.call(this);

    if (this.config.hot) {
      enableHotReloading.call(this);
    }
  }
}

module.exports = WebpackSSRDevServer;
