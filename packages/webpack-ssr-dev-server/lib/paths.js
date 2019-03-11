const fs = require("fs");
const path = require("path");

const paths = config => {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

  return {
    // Build
    clientBuild: resolveApp("build/client"),
    serverBuild: resolveApp("build/server"),
    // Src
    src: resolveApp("src"),
    clientSrc: resolveApp("src/client"),
    serverSrc: resolveApp("src/server"),
    commonSrc: resolveApp("src/common"),
    // Config
    clientWebpack: resolveApp("config/webpack.config.client"),
    serverWebpack: resolveApp("config/webpack.config.server"),
    dotenv: resolveApp(".env"),
    publicPath: "/static/"
  };
};

module.exports = paths;
