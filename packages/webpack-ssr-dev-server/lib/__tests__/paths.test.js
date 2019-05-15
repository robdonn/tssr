const fs = require("fs");
const path = require("path");
const paths = require("../paths");

jest.mock("fs");
jest.mock("path");

const { cwd } = process;

describe("paths", () => {
  beforeAll(() => {
    process.cwd = jest.fn();
  });

  beforeEach(() => {
    process.cwd.mockClear();
    fs.realpathSync.mockClear();
    path.resolve.mockClear();
  });

  afterAll(() => {
    process.cwd = cwd;
  });

  it("returns paths", () => {
    process.cwd.mockReturnValueOnce("TEST_DIR");
    const actualPaths = paths();

    expect(fs.realpathSync).toHaveBeenCalledTimes(1);
    expect(fs.realpathSync).toHaveBeenNthCalledWith(1, "TEST_DIR");

    expect(path.resolve).toHaveBeenCalledTimes(9);
    expect(path.resolve).toHaveBeenNthCalledWith(1, "TEST_DIR", "build/client");
    expect(path.resolve).toHaveBeenNthCalledWith(2, "TEST_DIR", "build/server");
    expect(path.resolve).toHaveBeenNthCalledWith(3, "TEST_DIR", "src");
    expect(path.resolve).toHaveBeenNthCalledWith(4, "TEST_DIR", "src/client");
    expect(path.resolve).toHaveBeenNthCalledWith(5, "TEST_DIR", "src/server");
    expect(path.resolve).toHaveBeenNthCalledWith(6, "TEST_DIR", "src/common");
    expect(path.resolve).toHaveBeenNthCalledWith(
      7,
      "TEST_DIR",
      "config/webpack.config.client"
    );
    expect(path.resolve).toHaveBeenNthCalledWith(
      8,
      "TEST_DIR",
      "config/webpack.config.server"
    );
    expect(path.resolve).toHaveBeenNthCalledWith(9, "TEST_DIR", ".env");

    expect(actualPaths).toEqual({
      clientBuild: "TEST_DIR+build/client",
      serverBuild: "TEST_DIR+build/server",
      src: "TEST_DIR+src",
      clientSrc: "TEST_DIR+src/client",
      serverSrc: "TEST_DIR+src/server",
      commonSrc: "TEST_DIR+src/common",
      clientWebpack: "TEST_DIR+config/webpack.config.client",
      serverWebpack: "TEST_DIR+config/webpack.config.server",
      dotenv: "TEST_DIR+.env",
      publicPath: "/static/"
    });
  });

  it("returns paths from config", () => {
    process.cwd.mockReturnValueOnce("TEST_DIR");
    const mockConfig = {
      paths: {
        clientBuild: "clientBuildFromConfig",
        serverBuild: "serverBuildFromConfig",
        src: "srcFromConfig",
        clientSrc: "clientSrcFromConfig",
        serverSrc: "serverSrcFromConfig",
        commonSrc: "commonSrcFromConfig",
        clientWebpack: "clientWebpackFromConfig",
        serverWebpack: "serverWebpackFromConfig",
        dotenv: "dotenvFromConfig",
        publicPath: "publicPathFromConfig"
      }
    };
    const actualPaths = paths(mockConfig);

    expect(fs.realpathSync).toHaveBeenCalledTimes(1);
    expect(fs.realpathSync).toHaveBeenNthCalledWith(1, "TEST_DIR");

    expect(path.resolve).toHaveBeenCalledTimes(9);
    expect(path.resolve).toHaveBeenNthCalledWith(
      1,
      "TEST_DIR",
      mockConfig.paths.clientBuild
    );
    expect(path.resolve).toHaveBeenNthCalledWith(
      2,
      "TEST_DIR",
      mockConfig.paths.serverBuild
    );
    expect(path.resolve).toHaveBeenNthCalledWith(
      3,
      "TEST_DIR",
      mockConfig.paths.src
    );
    expect(path.resolve).toHaveBeenNthCalledWith(
      4,
      "TEST_DIR",
      mockConfig.paths.clientSrc
    );
    expect(path.resolve).toHaveBeenNthCalledWith(
      5,
      "TEST_DIR",
      mockConfig.paths.serverSrc
    );
    expect(path.resolve).toHaveBeenNthCalledWith(
      6,
      "TEST_DIR",
      mockConfig.paths.commonSrc
    );
    expect(path.resolve).toHaveBeenNthCalledWith(
      7,
      "TEST_DIR",
      mockConfig.paths.clientWebpack
    );
    expect(path.resolve).toHaveBeenNthCalledWith(
      8,
      "TEST_DIR",
      mockConfig.paths.serverWebpack
    );
    expect(path.resolve).toHaveBeenNthCalledWith(
      9,
      "TEST_DIR",
      mockConfig.paths.dotenv
    );

    expect(actualPaths).toEqual({
      clientBuild: "TEST_DIR+clientBuildFromConfig",
      serverBuild: "TEST_DIR+serverBuildFromConfig",
      src: "TEST_DIR+srcFromConfig",
      clientSrc: "TEST_DIR+clientSrcFromConfig",
      serverSrc: "TEST_DIR+serverSrcFromConfig",
      commonSrc: "TEST_DIR+commonSrcFromConfig",
      clientWebpack: "TEST_DIR+clientWebpackFromConfig",
      serverWebpack: "TEST_DIR+serverWebpackFromConfig",
      dotenv: "TEST_DIR+dotenvFromConfig",
      publicPath: "publicPathFromConfig"
    });
  });
});
