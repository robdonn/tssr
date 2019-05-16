const resolveApp = require("./resolveApp");

const paths = config => {
  const configPaths = (config && config.paths) || {};

  return {
    // Build
    clientBuild: resolveApp(configPaths.clientBuild || "build/client"),
    serverBuild: resolveApp(configPaths.serverBuild || "build/server"),
    // Src
    src: resolveApp(configPaths.src || "src"),
    clientSrc: resolveApp(configPaths.clientSrc || "src/client"),
    serverSrc: resolveApp(configPaths.serverSrc || "src/server"),
    commonSrc: resolveApp(configPaths.commonSrc || "src/common"),
    // Config
    clientWebpack: resolveApp(
      configPaths.clientWebpack || "config/webpack.config.client"
    ),
    serverWebpack: resolveApp(
      configPaths.serverWebpack || "config/webpack.config.server"
    ),
    dotenv: resolveApp(configPaths.dotenv || ".env"),
    publicPath: configPaths.publicPath || "/static/"
  };
};

module.exports = paths;
