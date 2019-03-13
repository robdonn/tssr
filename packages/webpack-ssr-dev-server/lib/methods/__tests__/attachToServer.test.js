const Express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const { attachToServer, allowAccessControl } = require("../attachToServer");

jest.mock("express");
jest.mock("webpack-dev-middleware");
jest.mock("webpack-hot-middleware");

describe("attachToServer", () => {
  it("attaches middlewares to server application", () => {
    process.env.WEBPACK_DEVSERVER_PORT = "WEBPACK_DEVSERVER_PORT";

    webpackDevMiddleware.mockReturnValueOnce("webpackDevMiddleware");
    webpackHotMiddleware.mockReturnValueOnce("webpackHotMiddleware");
    Express.static.mockReturnValueOnce("express.static");

    const mockApp = new Express();
    const mockConfig = {
      app: mockApp,
      compiler: {
        client: {
          name: "client"
        }
      },
      paths: {
        clientBuild: "clientBuild"
      },
      watchOptions: "watchOptions",
      webpackConfig: {
        client: {
          output: {
            publicPath: "publicPath"
          },
          stats: "stats"
        }
      }
    };

    attachToServer.call(mockConfig);

    expect(mockApp.use).toHaveBeenCalledTimes(4);
    expect(mockApp.use).toHaveBeenNthCalledWith(1, allowAccessControl);

    expect(mockApp.use).toHaveBeenNthCalledWith(2, "webpackDevMiddleware");
    expect(webpackDevMiddleware).toHaveBeenCalledTimes(1);
    expect(webpackDevMiddleware).toHaveBeenNthCalledWith(
      1,
      { name: "client" },
      {
        publicPath: "publicPath",
        stats: "stats",
        watchOptions: "watchOptions"
      }
    );

    expect(mockApp.use).toHaveBeenNthCalledWith(3, "webpackHotMiddleware");
    expect(webpackHotMiddleware).toHaveBeenCalledTimes(1);
    expect(webpackHotMiddleware).toHaveBeenNthCalledWith(1, { name: "client" });

    expect(mockApp.use).toHaveBeenNthCalledWith(4, "/static", "express.static");
    expect(Express.static).toHaveBeenCalledTimes(1);
    expect(Express.static).toHaveBeenNthCalledWith(1, "clientBuild");

    expect(mockApp.listen).toHaveBeenCalledTimes(1);
    expect(mockApp.listen).toHaveBeenNthCalledWith(1, "WEBPACK_DEVSERVER_PORT");
  });
});
