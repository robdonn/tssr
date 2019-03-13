const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const allowAccessControl = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  return next();
};
function attachToServer() {
  this.app.use(allowAccessControl);

  this.app.use(
    webpackDevMiddleware(this.compiler.client, {
      publicPath: this.webpackConfig.client.output.publicPath,
      stats: this.webpackConfig.client.stats,
      watchOptions: this.watchOptions
    })
  );

  this.app.use(webpackHotMiddleware(this.compiler.client));

  this.app.use("/static", express.static(this.paths.clientBuild));

  this.app.listen(process.env.WEBPACK_DEVSERVER_PORT);
}

module.exports = {
  attachToServer,
  allowAccessControl
};
