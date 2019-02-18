module.exports = {
  displayName: 'build',
  testEnvironment: 'jsdom',
  rootDir: './',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
