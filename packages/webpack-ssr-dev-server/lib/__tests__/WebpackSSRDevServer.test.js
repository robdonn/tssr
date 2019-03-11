const fsX = require("fs-extra");
const paths = require("../paths");
const WebpackSSRDevServer = require("../WebpackSSRDevServer");

jest.mock("express");
jest.mock("fs-extra");
jest.mock("nodemon");
jest.mock("webpack");
jest.mock("../paths");

describe("WebpackSSRDevServer", () => {
  beforeEach(() => {
    fsX.existsSync.mockClear();
    fsX.emptyDirSync.mockClear();
    paths.mockClear();
  });

  it("creates a dev server", () => {
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
