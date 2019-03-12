const hasErrors = jest.fn();

class TappedPromise {
  constructor(
    stats = {
      hasErrors
    }
  ) {
    this.stats = stats;
  }
  tap(name, cb) {
    if (typeof cb === "function") cb(this.stats);
  }
}

const webpack = jest.fn(configs => ({
  compilers: configs.map(config => ({
    name: config.name,
    hooks: {
      compile: new TappedPromise(),
      done: new TappedPromise()
    }
  }))
}));

webpack.hasErrors = hasErrors;
webpack.TappedPromise = TappedPromise;

module.exports = webpack;
