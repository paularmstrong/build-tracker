/**
 * Copyright (c) 2019 Paul Armstrong
 */
const path = require('path');

module.exports = {
  globals: {
    'ts-jest': {
      skipBabel: true
    }
  },
  displayName: 'app',
  moduleNameMapper: {
    'react-art': '<rootDir>/src/app/config/jest/react-art-stub.js'
  },
  preset: 'react-native-web',
  rootDir: path.join(__dirname, '../..'),
  roots: ['<rootDir>/src/app'],
  setupFiles: ['<rootDir>/src/app/config/jest/setup.js'],
  setupFilesAfterEnv: ['react-testing-library/cleanup-after-each'],
  testEnvironment: 'jsdom',
  timers: 'fake',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
