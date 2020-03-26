/**
 * Copyright (c) 2019 Paul Armstrong
 */
module.exports = {
  preset: '../../config/jest.js',
  displayName: 'app',
  moduleNameMapper: {
    '\\.png$': '<rootDir>/config/jest/fileMock.js',
    '^react-native$': require.resolve('react-native-web'),
  },
  rootDir: './',
  roots: ['<rootDir>/src'],
  setupFiles: ['react-native-web/jest/setup.js', '<rootDir>/config/jest/setup.js'],
  testEnvironment: 'jsdom',
};
