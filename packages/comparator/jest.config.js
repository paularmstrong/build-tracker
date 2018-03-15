module.exports = {
  displayName: 'comparator',
  testEnvironment: 'node',
  rootDir: './',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
