const path = require('path');

module.exports = {
  displayName: 'app',
  moduleNameMapper: {
    'react-art': '<rootDir>/src/app/config/jest/react-art-stub.js'
  },
  preset: 'react-native-web',
  rootDir: path.join(__dirname, '../..'),
  roots: ['<rootDir>/src/app'],
  setupFiles: ['<rootDir>/src/app/config/jest/setup.js'],
  testEnvironment: 'jsdom',
  timers: 'fake',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
