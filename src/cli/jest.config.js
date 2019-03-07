/**
 * Copyright (c) 2019 Paul Armstrong
 */
module.exports = {
  displayName: 'cli',
  testEnvironment: 'node',
  rootDir: './',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
