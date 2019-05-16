const mockPaths = {
  clientBuild: "clientBuild",
  serverBuild: "serverBuild",
  clientSrc: "clientSrc",
  serverSrc: "serverSrc",
  commonSrc: "commonSrc",
  clientWebpack: "clientWebpack",
  serverWebpack: "serverWebpack",
  dotenv: "dotenv",
  publicPath: "publicPath"
};

const paths = jest.fn(() => mockPaths);
paths.mockPaths = mockPaths;

module.exports = paths;
