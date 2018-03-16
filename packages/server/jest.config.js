module.exports = {
  displayName: 'server',
  testEnvironment: 'node',
  rootDir: './',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
