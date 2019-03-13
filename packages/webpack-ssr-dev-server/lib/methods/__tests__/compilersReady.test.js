const { compilersReady } = require("../compilersReady");

let mockConfig;

const { error } = global.console;

describe("compilersReady", () => {
  beforeAll(() => {
    global.console.error = jest.fn();
  });

  beforeEach(() => {
    global.console.error.mockClear();
    mockConfig = {
      compilerPromise: {
        client: Promise.resolve(),
        server: Promise.resolve()
      }
    };
  });

  afterAll(() => {
    global.console.error = error;
  });

  it("resolves when both compilers complete", async () => {
    await compilersReady.call(mockConfig);

    expect(global.console.error).toHaveBeenCalledTimes(0);
  });

  it.each([["client"], ["server"]])(
    "logs error when %s compiler fails",
    async type => {
      const expectedError = new Error(`${type} failed`);
      mockConfig.compilerPromise[type] = Promise.reject(expectedError);

      await compilersReady.call(mockConfig);

      expect(global.console.error).toHaveBeenCalledTimes(1);
      expect(global.console.error).toHaveBeenNthCalledWith(1, expectedError);
    }
  );
});
