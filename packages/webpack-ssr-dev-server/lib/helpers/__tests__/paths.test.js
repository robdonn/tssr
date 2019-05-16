const resolveApp = require("../resolveApp");
const paths = require("../paths");

jest.mock("../resolveApp");

describe("paths", () => {
  beforeEach(() => {
    resolveApp.mockClear();
  });

  it("returns paths", () => {
    const actualPaths = paths();

    expect(resolveApp).toHaveBeenCalledTimes(9);
    expect(resolveApp).toHaveBeenNthCalledWith(1, "build/client");
    expect(resolveApp).toHaveBeenNthCalledWith(2, "build/server");
    expect(resolveApp).toHaveBeenNthCalledWith(3, "src");
    expect(resolveApp).toHaveBeenNthCalledWith(4, "src/client");
    expect(resolveApp).toHaveBeenNthCalledWith(5, "src/server");
    expect(resolveApp).toHaveBeenNthCalledWith(6, "src/common");
    expect(resolveApp).toHaveBeenNthCalledWith(
      7,
      "config/webpack.config.client"
    );
    expect(resolveApp).toHaveBeenNthCalledWith(
      8,
      "config/webpack.config.server"
    );
    expect(resolveApp).toHaveBeenNthCalledWith(9, ".env");

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

    expect(resolveApp).toHaveBeenCalledTimes(9);
    expect(resolveApp).toHaveBeenNthCalledWith(1, mockConfig.paths.clientBuild);
    expect(resolveApp).toHaveBeenNthCalledWith(2, mockConfig.paths.serverBuild);
    expect(resolveApp).toHaveBeenNthCalledWith(3, mockConfig.paths.src);
    expect(resolveApp).toHaveBeenNthCalledWith(4, mockConfig.paths.clientSrc);
    expect(resolveApp).toHaveBeenNthCalledWith(5, mockConfig.paths.serverSrc);
    expect(resolveApp).toHaveBeenNthCalledWith(6, mockConfig.paths.commonSrc);
    expect(resolveApp).toHaveBeenNthCalledWith(
      7,
      mockConfig.paths.clientWebpack
    );
    expect(resolveApp).toHaveBeenNthCalledWith(
      8,
      mockConfig.paths.serverWebpack
    );
    expect(resolveApp).toHaveBeenNthCalledWith(9, mockConfig.paths.dotenv);

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
