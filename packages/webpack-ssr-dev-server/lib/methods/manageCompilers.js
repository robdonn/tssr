const webpack = require("webpack");

const compilerPromise = (name, compiler) =>
  new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      console.log(`${name} compiling...`);
    });
    compiler.hooks.done.tap(name, stats => {
      if (!stats.hasErrors()) {
        return resolve();
      }
      return reject(new Error(`Failed to compile ${name}`));
    });
  });

function manageCompilers() {
  const multiCompiler = webpack([
    this.webpackConfig.client,
    this.webpackConfig.server
  ]);

  this.compiler = {
    client: multiCompiler.compilers.find(
      compiler => compiler.name === "client"
    ),
    server: multiCompiler.compilers.find(compiler => compiler.name === "server")
  };

  this.compilerPromise = {
    client: compilerPromise("client", this.compiler.client),
    server: compilerPromise("server", this.compiler.server)
  };
}

module.exports = {
  manageCompilers
};
