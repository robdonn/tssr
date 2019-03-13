function watchCallback(error, stats) {
  if (error || stats.hasErrors()) {
    if (error) {
      console.error(error);
    }

    if (stats.hasErrors()) {
      const info = stats.toJson();
      const errors = info.errors[0].split("\n");
      console.log(errors[0]);
      console.log(errors[1]);
      console.log(errors[2]);
    }
  } else {
    console.log(stats.toString(this.webpackConfig.server.stats));
  }
}

function watchServerCompiler() {
  this.compiler.server.watch(this.watchOptions, watchCallback.bind(this));
}

module.exports = {
  watchServerCompiler,
  watchCallback
};
