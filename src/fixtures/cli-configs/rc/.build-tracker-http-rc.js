const path = require('path');

module.exports = {
  applicationUrl: 'http://build-tracker.local',
  artifacts: ['../fakedist/*.js'],
  baseDir: path.resolve(__dirname, 'fakedist'),
  cwd: __dirname
};
