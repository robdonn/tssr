const express = require("express");

const paths = require("./helpers/paths");
const { ensureRequiredDirs } = require("./methods/ensureRequiredDirs");
const { enableHotReloading } = require("./methods/enableHotReloading");
const { setPublicPath } = require("./methods/setPublicPath");
const { manageCompilers } = require("./methods/manageCompilers");
const { attachToServer } = require("./methods/attachToServer");
const { watchServerCompiler } = require("./methods/watchServerCompiler");
const { compilersReady } = require("./methods/compilersReady");
const { createWatcher } = require("./methods/createWatcher");

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

  async init() {
    setPublicPath.call(this);

    manageCompilers.call(this);

    attachToServer.call(this);

    watchServerCompiler.call(this);

    await compilersReady.call(this);

    createWatcher.call(this);
  }
}

module.exports = WebpackSSRDevServer;
