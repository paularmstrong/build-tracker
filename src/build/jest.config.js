/**
 * Copyright (c) 2019 Paul Armstrong
 */
module.exports = {
  displayName: 'build',
  testEnvironment: 'node',
  rootDir: './',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
