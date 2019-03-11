module.exports = {
  resolve: jest.fn((...values) => values.join("+"))
};
