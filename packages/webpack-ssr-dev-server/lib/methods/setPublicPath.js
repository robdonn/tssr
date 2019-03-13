function setPublicPath() {
  this.webpackConfig.client.output = this.webpackConfig.client.output || {};
  this.webpackConfig.server.output = this.webpackConfig.server.output || {};

  this.config.publicPath = this.webpackConfig.client.output.publicPath || "";

  const publicPath = `${process.env.WEBPACK_DEVSERVER_HOST}:${
    process.env.WEBPACK_DEVSERVER_PORT
  }/${this.config.publicPath}`.replace(/([^:+])\/+/g, "$1/");

  this.webpackConfig.client.output.publicPath = publicPath;

  this.webpackConfig.server.output.publicPath = publicPath;
}

module.exports = {
  setPublicPath
};
