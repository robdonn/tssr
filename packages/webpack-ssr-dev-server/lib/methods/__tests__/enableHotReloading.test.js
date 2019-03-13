const paths = require("../../paths");
const { enableHotReloading } = require("../enableHotReloading");
const enableHotReloadingScenarios = require("./enableHotReloading.scenarios.json");

jest.mock("../../paths");

const { env } = process;

describe("enableHotReloading", () => {
  beforeEach(() => {
    process.env.WEBPACK_DEVSERVER_HOST = "WEBPACK_DEVSERVER_HOST";
    process.env.WEBPACK_DEVSERVER_PORT = "WEBPACK_DEVSERVER_PORT";
  });

  afterEach(() => {
    process.env = { ...env };
  });

  it.each(enableHotReloadingScenarios)(
    "adds Hot Module Replacement entrypoints if %s",
    (scenario, { configFileName, config, result }) => {
      jest.doMock(configFileName, () => config, { virtual: true });

      const mockConfig = require(configFileName);

      const internalConfig = {
        paths: {
          ...paths.mockPaths,
          clientWebpack: configFileName
        },
        webpackConfig: {
          client: mockConfig
        }
      };

      enableHotReloading.call(internalConfig);

      expect(internalConfig.webpackConfig.client.entry).toEqual(result);
    }
  );

  it("adds output hotUpdate filename properties to output", () => {
    jest.doMock(
      "clientWebpack_withNoOutput",
      () => ({
        entry: "app.js"
      }),
      { virtual: true }
    );

    const mockConfig = require("clientWebpack_withNoOutput");

    const internalConfig = {
      paths: {
        ...paths.mockPaths,
        clientWebpack: "clientWebpack_withNoOutput"
      },
      webpackConfig: {
        client: mockConfig
      }
    };

    enableHotReloading.call(internalConfig);

    expect(internalConfig.webpackConfig.client.output).toEqual({
      hotUpdateChunkFilename: "updates/[id].[hash].hot-update.js",
      hotUpdateMainFilename: "updates/[hash].hot-update.json"
    });
  });

  it("throws error if entry is not defined", () => {
    jest.doMock("clientWebpack_withNoEntry", () => ({}), { virtual: true });

    const mockConfig = require("clientWebpack_withNoEntry");

    const internalConfig = {
      paths: {
        ...paths.mockPaths,
        clientWebpack: "clientWebpack_withNoEntry"
      },
      webpackConfig: {
        client: mockConfig
      }
    };

    const expectedError = new Error(
      "No entry declared in client webpack config"
    );

    expect(() => {
      enableHotReloading.call(internalConfig);
    }).toThrowError(expectedError);
  });
});
