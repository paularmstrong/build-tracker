module.exports = {
  name: 'build-tracker',
  rootDir: './',
  projects: ['<rootDir>/packages/*'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
