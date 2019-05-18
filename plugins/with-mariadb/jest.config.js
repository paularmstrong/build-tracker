/**
 * Copyright (c) 2019 Paul Armstrong
 */
module.exports = {
  displayName: 'with-mariadb',
  testEnvironment: 'node',
  resetMocks: true,
  rootDir: './',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
