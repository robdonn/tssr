const path = require("path");
const globby = require("globby");

const core = {
  bail: false,
  coverageReporters: ["text-summary", "html", "lcov"],
  roots: [path.join(__dirname, "__mocks__")],
  rootDir: __dirname,
  testMatch: ["**/__tests__/*.test.js"]
};

const coverage = {
  collectCoverage: true,
  coverageDirectory: path.join(__dirname, "coverage"),
  collectCoverageFrom: ["<rootDir>/packages/**/*.js"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};

const config = {
  ...core,
  ...coverage,
  projects: require("./package.json")
    .workspaces.packages.reduce(
      (projects, glob) =>
        projects.concat(
          globby.sync(path.join(glob, "package.json"), {
            cwd: __dirname,
            strict: true,
            absolute: true
          })
        ),
      []
    )
    .map(packageJsonPath => {
      const packageInfo = require(packageJsonPath);
      const packagePath = path.dirname(path.normalize(packageJsonPath));

      return {
        displayName: packageInfo.name,
        name: packageInfo.name,
        ...core,
        roots: [...core.roots, packagePath]
      };
    })
};

module.exports = config;
