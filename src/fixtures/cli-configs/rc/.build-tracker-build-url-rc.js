const path = require('path');

module.exports = {
  applicationUrl: 'https://build-tracker.local',
  artifacts: ['../fakedist/*.js'],
  baseDir: path.resolve(__dirname, 'fakedist'),
  buildUrlFormat: 'https://github.com/paularmstrong/build-tracker/commit/:revision',
  cwd: __dirname
};
