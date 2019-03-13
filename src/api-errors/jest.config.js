/**
 * Copyright (c) 2019 Paul Armstrong
 */
module.exports = {
  displayName: 'api-errors',
  testEnvironment: 'node',
  resetMocks: true,
  rootDir: './',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
