// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./src/tests/setupTests.ts'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    // other configuration...
  };