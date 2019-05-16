module.exports = {
  resolve: jest.fn((...values) => values.join("+")),
  isAbsolute: jest.fn()
};
