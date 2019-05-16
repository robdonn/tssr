const fsX = require("fs-extra");

function ensureRequiredDirs() {
  if (
    !fsX.existsSync(this.paths.clientSrc) ||
    !fsX.existsSync(this.paths.serverSrc) ||
    !fsX.existsSync(this.paths.commonSrc)
  ) {
    throw new Error("Source directories do not exist.");
  }

  try {
    this.webpackConfig = {
      client: require(this.paths.clientWebpack),
      server: require(this.paths.serverWebpack)
    };
  } catch (error) {
    throw new Error("Webpack configurations do not exist.");
  }

  this.watchOptions = {
    ignored: /node_modules/,
    stats: this.webpackConfig.client.stats
  };

  fsX.emptyDirSync(this.paths.clientBuild);
  fsX.emptyDirSync(this.paths.serverBuild);
}

module.exports = {
  ensureRequiredDirs
};
