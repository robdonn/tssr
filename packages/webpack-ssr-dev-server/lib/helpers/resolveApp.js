const fs = require("fs");
const path = require("path");

const resolveApp = givenPath => {
  const appDirectory = fs.realpathSync(process.cwd());
  return path.isAbsolute(givenPath)
    ? givenPath
    : path.resolve(appDirectory, givenPath);
};

module.exports = resolveApp;
