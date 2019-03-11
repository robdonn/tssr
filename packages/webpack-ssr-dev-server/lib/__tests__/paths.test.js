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
});
