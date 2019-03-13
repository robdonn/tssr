const {
  watchServerCompiler,
  watchCallback
} = require("../watchServerCompiler");

const mockConfig = {
  watchOptions: "watchOptions",
  compiler: {
    server: {
      watch: jest.fn()
    }
  },
  webpackConfig: {
    server: {
      stats: {}
    }
  }
};

const mockStats = {
  hasErrors: jest.fn(),
  toJson: jest.fn()
};

const { log, error } = global.console;
describe("watchServerCompiler", () => {
  beforeAll(() => {
    global.console.log = jest.fn();
    global.console.error = jest.fn();
  });

  beforeEach(() => {
    global.console.log.mockClear();
    global.console.error.mockClear();
    mockConfig.compiler.server.watch.mockClear();
    mockStats.hasErrors.mockClear();
    mockStats.toJson.mockClear();
  });

  afterAll(() => {
    global.console.log = log;
    global.console.error = error;
  });

  it("should attach watcher to server compiler", () => {
    watchServerCompiler.call(mockConfig);

    expect(mockConfig.compiler.server.watch).toHaveBeenCalledTimes(1);
    expect(mockConfig.compiler.server.watch).toHaveBeenNthCalledWith(
      1,
      mockConfig.watchOptions,
      expect.any(Function)
    );
  });

  it("should print stats if no errors", () => {
    watchCallback.call(mockConfig, undefined, mockStats);

    expect(mockStats.hasErrors).toHaveBeenCalledTimes(1);
    expect(mockStats.hasErrors).toHaveBeenNthCalledWith(1);

    expect(global.console.log).toHaveBeenCalledTimes(1);
    expect(global.console.log).toHaveBeenNthCalledWith(1, "[object Object]");
  });

  it("should print error if provided", () => {
    const expectedError = new Error("No way");

    watchCallback.call(mockConfig, expectedError, mockStats);

    expect(mockStats.hasErrors).toHaveBeenCalledTimes(1);
    expect(mockStats.hasErrors).toHaveBeenNthCalledWith(1);

    expect(global.console.error).toHaveBeenCalledTimes(1);
    expect(global.console.error).toHaveBeenNthCalledWith(1, expectedError);
  });

  it("should print stat error if provided", () => {
    mockStats.hasErrors.mockReturnValue("true");
    mockStats.toJson.mockReturnValueOnce({
      errors: ["line1\nline2\nline3\nline4"]
    });

    watchCallback.call(mockConfig, undefined, mockStats);

    expect(mockStats.hasErrors).toHaveBeenCalledTimes(2);
    expect(mockStats.hasErrors).toHaveBeenNthCalledWith(1);
    expect(mockStats.hasErrors).toHaveBeenNthCalledWith(2);

    expect(global.console.log).toHaveBeenCalledTimes(3);
    expect(global.console.log).toHaveBeenNthCalledWith(1, "line1");
    expect(global.console.log).toHaveBeenNthCalledWith(2, "line2");
    expect(global.console.log).toHaveBeenNthCalledWith(3, "line3");
  });
});
