/**
 * Copyright (c) 2019 Paul Armstrong
 */
module.exports = {
  preset: '../../config/jest.js',
  displayName: 'app',
  moduleNameMapper: {
    'react-art': '<rootDir>/config/jest/react-art-stub.js',
    '^react-native$': '<rootDir>/../../node_modules/react-native-web/dist/cjs'
  },
  rootDir: './',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/../../node_modules/react-native-web/jest/setup.js', '<rootDir>/config/jest/setup.js'],
  setupFilesAfterEnv: ['react-testing-library/cleanup-after-each'],
  testEnvironment: 'jsdom'
};
