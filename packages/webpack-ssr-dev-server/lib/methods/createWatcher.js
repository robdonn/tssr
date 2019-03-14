const nodemon = require("nodemon");

const handleRestart = () => {
  console.log("Server side app has been restarted.");
};

const handleQuit = () => {
  console.log("Process ended");
  process.exit(0);
};

const handleError = error => {
  console.log("An error has occured");
  console.error(error);
  process.exit(1);
};

function createWatcher() {
  this.watcher = nodemon({
    script: `${this.paths.serverBuild}/server.js`,
    ignore: ["src", "scripts", "config", "./*.*", "build/client"]
  });

  this.watcher.on("restart", handleRestart);

  this.watcher.on("quit", handleQuit);

  this.watcher.on("error", handleError);
}

module.exports = {
  createWatcher
};
