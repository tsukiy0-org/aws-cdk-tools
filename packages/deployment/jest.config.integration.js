module.exports = {
  ...require('./jest.config'),
  testMatch: ['**/*.integration.ts'],
  testTimeout: 240000,
};
