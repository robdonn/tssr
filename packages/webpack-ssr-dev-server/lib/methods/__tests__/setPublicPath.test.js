const { setPublicPath } = require("../setPublicPath");

const { env } = process;

describe("setPublicPath", () => {
  beforeEach(() => {
    process.env.WEBPACK_DEVSERVER_HOST = "WEBPACK_DEVSERVER_HOST";
    process.env.WEBPACK_DEVSERVER_PORT = "WEBPACK_DEVSERVER_PORT";
  });

  afterAll(() => {
    process.env = { ...env };
  });

  it("should add public path to client and server output properties", () => {
    const mockConfig = {
      config: {},
      webpackConfig: {
        client: {},
        server: {}
      }
    };

    setPublicPath.call(mockConfig);

    expect(mockConfig).toEqual({
      config: {
        publicPath: ""
      },
      webpackConfig: {
        client: {
          output: {
            publicPath: "WEBPACK_DEVSERVER_HOST:WEBPACK_DEVSERVER_PORT/"
          }
        },
        server: {
          output: {
            publicPath: "WEBPACK_DEVSERVER_HOST:WEBPACK_DEVSERVER_PORT/"
          }
        }
      }
    });
  });
});
