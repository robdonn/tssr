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

    expect(mockConfig.compiler).toEqual({
      client: {
        name: "client",
        hooks: {
          compile: expect.any(TappedPromise),
          done: expect.any(TappedPromise)
        }
      },
      server: {
        name: "server",
        hooks: {
          compile: expect.any(TappedPromise),
          done: expect.any(TappedPromise)
        }
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

  it.each([["client", true, false], ["server", false, true]])(
    "should throw if %s compiler has errors",
    (name, client, server, done) => {
      hasErrors.mockReturnValueOnce(client).mockReturnValueOnce(server);
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
        expect(error.message).toEqual(`Failed to compile ${name}`);
        done();
      });
    }
  );
});
