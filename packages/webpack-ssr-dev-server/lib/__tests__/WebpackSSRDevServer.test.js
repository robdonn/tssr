const paths = require("paths");
const { enableHotReloading } = require("../methods/enableHotReloading");
const { ensureRequiredDirs } = require("../methods/ensureRequiredDirs");

const WebpackSSRDevServer = require("../WebpackSSRDevServer");

jest.mock("express");
jest.mock("../paths");
jest.mock("../methods/enableHotReloading");
jest.mock("../methods/ensureRequiredDirs");

describe("WebpackSSRDevServer", () => {
  beforeEach(() => {
    enableHotReloading.mockClear();
    ensureRequiredDirs.mockClear();
  });

  it("should create a devServer object with express server attached", () => {
    const devServer = new WebpackSSRDevServer();

    expect(devServer.config).toEqual({});
    expect(devServer.app).toEqual(expect.any(Object));
    expect(devServer.paths).toEqual(paths.mockPaths);

    expect(ensureRequiredDirs).toHaveBeenCalledTimes(1);
    expect(ensureRequiredDirs).toHaveBeenNthCalledWith(1);

    expect(enableHotReloading).toHaveBeenCalledTimes(0);
  });

  it("should call enableHotReloading if config.hot is true", () => {
    const devServer = new WebpackSSRDevServer({ hot: true });

    expect(devServer.config).toEqual({ hot: true });

    expect(ensureRequiredDirs).toHaveBeenCalledTimes(1);
    expect(ensureRequiredDirs).toHaveBeenNthCalledWith(1);

    expect(enableHotReloading).toHaveBeenCalledTimes(1);
    expect(enableHotReloading).toHaveBeenNthCalledWith(1);
  });
});
