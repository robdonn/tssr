const fsX = require("fs-extra");
const paths = require("../../helpers/paths");
const { ensureRequiredDirs } = require("../ensureRequiredDirs");

jest.mock("fs-extra");
jest.mock("../../helpers/paths");

jest.mock("clientWebpack", () => ({ stats: {} }), { virtual: true });
jest.mock("serverWebpack", () => ({}), { virtual: true });

let mockParent;

describe("ensureRequiredDirs", () => {
  afterEach(() => {
    fsX.existsSync.mockClear();
    fsX.emptyDirSync.mockClear();
  });

  it("checks for all required files", () => {
    fsX.existsSync.mockReturnValue(true);
    fsX.emptyDirSync.mockReturnValue(true);

    const mockConfig = {
      paths: paths.mockPaths
    };

    ensureRequiredDirs.call(mockConfig);

    expect(fsX.existsSync).toHaveBeenCalledTimes(3);
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

    expect(fsX.emptyDirSync).toHaveBeenCalledTimes(2);
    expect(fsX.emptyDirSync).toHaveBeenNthCalledWith(
      1,
      paths.mockPaths.clientBuild
    );
    expect(fsX.emptyDirSync).toHaveBeenNthCalledWith(
      2,
      paths.mockPaths.serverBuild
    );

    expect(mockConfig).toEqual({
      paths: paths.mockPaths,
      watchOptions: {
        ignored: /node_modules/,
        stats: {}
      },
      webpackConfig: {
        client: {
          stats: {}
        },
        server: {}
      }
    });
  });

  it("throws error if all source directories do not exist", () => {
    fsX.existsSync.mockReturnValueOnce(false);

    const expectedError = new Error("Source directories do not exist.");

    expect(() => {
      ensureRequiredDirs.call({ paths: {} });
    }).toThrowError(expectedError);
  });

  it("throws error if all webpack configs do not exist", () => {
    jest.unmock("serverWebpack");
    fsX.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);

    const expectedError = new Error("Webpack configurations do not exist.");

    expect(() => {
      ensureRequiredDirs.call({ paths: {} });
    }).toThrowError(expectedError);
  });
});
