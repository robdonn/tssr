const { TappedPromise, hasErrors } = require("webpack");
const { manageCompilers } = require("../manageCompilers");

jest.mock("webpack");

const { log } = global.console;

describe("manageCompilers", () => {
  beforeAll(() => {
    global.console.log = jest.fn();
  });

  beforeEach(() => {
    global.console.log.mockClear();
    hasErrors.mockClear();
  });

  afterAll(() => {
    global.console.log = log;
  });

  it("creates compilers and compiler promises", () => {
    hasErrors.mockReturnValue(false);
    const mockConfig = {
      webpackConfig: {
        client: {
          name: "client"
        },
        server: {
          name: "server"
        }
      }
    };

    manageCompilers.call(mockConfig);

    expect(mockConfig.compiler.client).toEqual({
      name: "client",
      hooks: {
        compile: expect.any(TappedPromise),
        done: expect.any(TappedPromise)
      }
    });
    expect(mockConfig.compiler.server).toEqual({
      name: "server",
      hooks: {
        compile: expect.any(TappedPromise),
        done: expect.any(TappedPromise)
      }
    });

    expect(mockConfig.compilerPromise.client).toEqual(expect.any(Promise));
    expect(mockConfig.compilerPromise.server).toEqual(expect.any(Promise));

    expect(global.console.log).toHaveBeenCalledTimes(2);
    expect(global.console.log).toHaveBeenNthCalledWith(
      1,
      "client compiling..."
    );
    expect(global.console.log).toHaveBeenNthCalledWith(
      2,
      "server compiling..."
    );
  });

  it("should throw if client compiler has errors", done => {
    hasErrors.mockReturnValueOnce(true).mockReturnValueOnce(false);
    const mockConfig = {
      webpackConfig: {
        client: {
          name: "client"
        },
        server: {
          name: "server"
        }
      }
    };

    manageCompilers.call(mockConfig);

    Promise.all([
      mockConfig.compilerPromise.client,
      mockConfig.compilerPromise.server
    ]).catch(error => {
      expect(error.message).toEqual("Failed to compile client");
      done();
    });
  });

  it("should throw if server compiler has errors", done => {
    hasErrors.mockReturnValueOnce(false).mockReturnValueOnce(true);
    const mockConfig = {
      webpackConfig: {
        client: {
          name: "client"
        },
        server: {
          name: "server"
        }
      }
    };

    manageCompilers.call(mockConfig);

    Promise.all([
      mockConfig.compilerPromise.client,
      mockConfig.compilerPromise.server
    ]).catch(error => {
      expect(error.message).toEqual("Failed to compile server");
      done();
    });
  });
});
