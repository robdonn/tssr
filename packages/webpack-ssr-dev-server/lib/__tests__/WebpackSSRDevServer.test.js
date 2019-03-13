const paths = require("paths");
const { enableHotReloading } = require("../methods/enableHotReloading");
const { ensureRequiredDirs } = require("../methods/ensureRequiredDirs");
const { setPublicPath } = require("../methods/setPublicPath");
const { manageCompilers } = require("../methods/manageCompilers");
const { attachToServer } = require("../methods/attachToServer");
const { watchServerCompiler } = require("../methods/watchServerCompiler");

const WebpackSSRDevServer = require("../WebpackSSRDevServer");

jest.mock("express");
jest.mock("../paths");
jest.mock("../methods/enableHotReloading");
jest.mock("../methods/ensureRequiredDirs");
jest.mock("../methods/setPublicPath");
jest.mock("../methods/manageCompilers");
jest.mock("../methods/attachToServer");
jest.mock("../methods/watchServerCompiler");

describe("WebpackSSRDevServer", () => {
  beforeEach(() => {
    enableHotReloading.mockClear();
    ensureRequiredDirs.mockClear();
    setPublicPath.mockClear();
    manageCompilers.mockClear();
    attachToServer.mockClear();
    watchServerCompiler.mockClear();
  });

  it("should create a devServer object with express server attached", () => {
    const devServer = new WebpackSSRDevServer();

    expect(devServer.config).toEqual({});
    expect(devServer.app).toEqual(expect.any(Object));
    expect(devServer.paths).toEqual(paths.mockPaths);

    expect(ensureRequiredDirs).toHaveBeenCalledTimes(1);
    expect(ensureRequiredDirs).toHaveBeenNthCalledWith(1);

    expect(enableHotReloading).toHaveBeenCalledTimes(0);

    devServer.init();

    expect(setPublicPath).toHaveBeenCalledTimes(1);
    expect(setPublicPath).toHaveBeenNthCalledWith(1);

    expect(manageCompilers).toHaveBeenCalledTimes(1);
    expect(manageCompilers).toHaveBeenNthCalledWith(1);

    expect(attachToServer).toHaveBeenCalledTimes(1);
    expect(attachToServer).toHaveBeenNthCalledWith(1);

    expect(watchServerCompiler).toHaveBeenCalledTimes(1);
    expect(watchServerCompiler).toHaveBeenNthCalledWith(1);
  });

  it("should call enableHotReloading if config.hot is true", () => {
    const devServer = new WebpackSSRDevServer({ hot: true });

    expect(devServer.config).toEqual({ hot: true });

    expect(ensureRequiredDirs).toHaveBeenCalledTimes(1);
    expect(ensureRequiredDirs).toHaveBeenNthCalledWith(1);

    expect(enableHotReloading).toHaveBeenCalledTimes(1);
    expect(enableHotReloading).toHaveBeenNthCalledWith(1);

    devServer.init();

    expect(setPublicPath).toHaveBeenCalledTimes(1);
    expect(setPublicPath).toHaveBeenNthCalledWith(1);

    expect(manageCompilers).toHaveBeenCalledTimes(1);
    expect(manageCompilers).toHaveBeenNthCalledWith(1);

    expect(attachToServer).toHaveBeenCalledTimes(1);
    expect(attachToServer).toHaveBeenNthCalledWith(1);

    expect(watchServerCompiler).toHaveBeenCalledTimes(1);
    expect(watchServerCompiler).toHaveBeenNthCalledWith(1);
  });
});
