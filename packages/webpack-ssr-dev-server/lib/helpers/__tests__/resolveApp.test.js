const fs = require("fs");
const path = require("path");
const resolveApp = require("../resolveApp");

jest.mock("fs");
jest.mock("path");

const { cwd } = process;

describe("resolveApp", () => {
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

  it("returns resolved path if relative", () => {
    process.cwd.mockReturnValueOnce("TEST_DIR");
    path.isAbsolute.mockReturnValueOnce(false);

    const actual = resolveApp("relativePath");

    expect(actual).toEqual("TEST_DIR+relativePath");
  });

  it("returns given path if absolute", () => {
    process.cwd.mockReturnValueOnce("TEST_DIR");
    path.isAbsolute.mockReturnValueOnce(true);

    const actual = resolveApp("absolutePath");

    expect(actual).toEqual("absolutePath");
  });
});
