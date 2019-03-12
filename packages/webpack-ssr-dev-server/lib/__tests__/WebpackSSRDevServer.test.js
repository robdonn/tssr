const fsX = require("fs-extra");
const paths = require("../paths");
const WebpackSSRDevServer = require("../WebpackSSRDevServer");
const enableHotReloadingScenarios = require("./WebpackSSRDevServer.enableHotReloading.scenarios.json");

jest.mock("express");
jest.mock("fs-extra");
jest.mock("nodemon");
jest.mock("webpack");
jest.mock("../paths");

jest.mock("clientWebpack", () => ({}), { virtual: true });
jest.mock("serverWebpack", () => ({}), { virtual: true });

const { env } = process;

describe("WebpackSSRDevServer", () => {
  afterEach(() => {
    fsX.existsSync.mockClear();
    fsX.emptyDirSync.mockClear();
    paths.mockClear();
    process.env = { ...env };
  });

  describe("ensureRequiredDirs", () => {
    it("checks for all required files", () => {
      fsX.existsSync.mockReturnValue(true);
      fsX.emptyDirSync.mockReturnValue(true);

      const devServer = new WebpackSSRDevServer();

      expect(fsX.existsSync).toHaveBeenCalledTimes(5);
      expect(fsX.existsSync).toHaveBeenNthCalledWith(
        1,
        paths.mockPaths.clientSrc
      );
      expect(fsX.existsSync).toHaveBeenNthCalledWith(
        2,
        paths.mockPaths.serverSrc
      );
      expect(fsX.existsSync).toHaveBeenNthCalledWith(
        3,
        paths.mockPaths.commonSrc
      );
      expect(fsX.existsSync).toHaveBeenNthCalledWith(
        4,
        paths.mockPaths.clientWebpack
      );
      expect(fsX.existsSync).toHaveBeenNthCalledWith(
        5,
        paths.mockPaths.serverWebpack
      );

      expect(fsX.emptyDirSync).toHaveBeenCalledTimes(2);
      expect(fsX.emptyDirSync).toHaveBeenNthCalledWith(
        1,
        paths.mockPaths.clientBuild
      );
      expect(fsX.emptyDirSync).toHaveBeenNthCalledWith(
        2,
        paths.mockPaths.serverBuild
      );

      expect(devServer.webpackConfig).toEqual({
        client: {},
        server: {}
      });
    });

    it("throws error if all source directories do not exist", () => {
      fsX.existsSync.mockReturnValueOnce(false);

      const expectedError = new Error("Source directories do not exist.");

      expect(() => {
        new WebpackSSRDevServer();
      }).toThrowError(expectedError);
    });

    it("throws error if all webpack configs do not exist", () => {
      fsX.existsSync
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const expectedError = new Error("Webpack configurations do not exist.");

      expect(() => {
        new WebpackSSRDevServer();
      }).toThrowError(expectedError);
    });
  });

  describe("enableHotReloading", () => {
    beforeEach(() => {
      process.env.WEBPACK_DEVSERVER_HOST = "WEBPACK_DEVSERVER_HOST";
      process.env.WEBPACK_DEVSERVER_PORT = "WEBPACK_DEVSERVER_PORT";
    });

    it.each(enableHotReloadingScenarios)(
      "adds Hot Module Replacement entrypoints if 'hot' option is true in config and %s",
      (scenario, { configFileName, config, result }) => {
        fsX.existsSync.mockReturnValue(true);
        fsX.emptyDirSync.mockReturnValue(true);
        paths.mockReturnValueOnce({
          ...paths.mockPaths,
          clientWebpack: configFileName
        });
        jest.doMock(configFileName, () => config, { virtual: true });

        const devServer = new WebpackSSRDevServer({ hot: true });

        expect(devServer.webpackConfig.client.entry).toEqual(result);
      }
    );

    it("throws error if 'hot' option is true in config and entry is not defined", () => {
      fsX.existsSync.mockReturnValue(true);
      fsX.emptyDirSync.mockReturnValue(true);
      paths.mockReturnValueOnce({
        ...paths.mockPaths,
        clientWebpack: "clientWebpack_withNoEntry"
      });
      jest.doMock("clientWebpack_withNoEntry", () => ({}), { virtual: true });

      const expectedError = new Error(
        "No entry declared in client webpack config"
      );

      expect(() => {
        new WebpackSSRDevServer({ hot: true });
      }).toThrowError(expectedError);
    });

    it("does not modify entry if 'hot' option is false", () => {
      fsX.existsSync.mockReturnValue(true);
      fsX.emptyDirSync.mockReturnValue(true);

      paths.mockReturnValueOnce({
        ...paths.mockPaths,
        clientWebpack: "clientWebpack_withEntryObjectOfStringsHotFalse"
      });
      jest.doMock(
        "clientWebpack_withEntryObjectOfStringsHotFalse",
        () => ({
          entry: {
            app: "app-entry",
            bundle: "bundle-entry"
          }
        }),
        { virtual: true }
      );

      const devServer = new WebpackSSRDevServer({ hot: false });

      expect(devServer.webpackConfig.client.entry).toEqual({
        app: "app-entry",
        bundle: "bundle-entry"
      });
    });
  });
});
