const handleArray = (entryArray, hmrEntry) => [hmrEntry, ...entryArray];

const handleString = (entryString, hmrEntry) => [hmrEntry, entryString];

const entryReducer = hmrEntry => (acc, [entryKey, entryValue]) => ({
  ...acc,
  [entryKey]:
    typeof entryValue === "string"
      ? handleString(entryValue, hmrEntry)
      : handleArray(entryValue, hmrEntry)
});

const handleEntry = config => {
  const hmrEntry = `webpack-hot-middleware/client?path=${
    process.env.WEBPACK_DEVSERVER_HOST
  }:${process.env.WEBPACK_DEVSERVER_PORT}/__webpack_hmr`;

  const { entry } = config.webpackConfig.client;

  if (typeof entry === "object") {
    if (!Array.isArray(entry)) {
      config.webpackConfig.client.entry = Object.entries(entry).reduce(
        entryReducer(hmrEntry),
        {}
      );
    } else {
      config.webpackConfig.client.entry = handleArray(entry, hmrEntry);
    }
  } else {
    config.webpackConfig.client.entry = handleString(entry, hmrEntry);
  }
};

const handleOutput = config => {
  config.webpackConfig.client.output = config.webpackConfig.client.output || {};

  config.webpackConfig.client.output.hotUpdateMainFilename =
    "updates/[hash].hot-update.json";
  config.webpackConfig.client.output.hotUpdateChunkFilename =
    "updates/[id].[hash].hot-update.js";
};

function enableHotReloading() {
  if (!this.webpackConfig.client.entry) {
    throw new Error("No entry declared in client webpack config");
  }

  handleEntry(this);

  handleOutput(this);
}

module.exports = {
  enableHotReloading
};
