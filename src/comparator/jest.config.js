/**
 * Copyright (c) 2019 Paul Armstrong
 */
module.exports = {
  displayName: 'comparator',
  testEnvironment: 'node',
  rootDir: './',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
