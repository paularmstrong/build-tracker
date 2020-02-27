const path = require('path');

module.exports = {
  applicationUrl: 'https://build-tracker.local',
  artifacts: ['../fakedist/**/*'],
  baseDir: path.resolve(__dirname, 'fakedist'),
  cwd: __dirname,
  onCompare: data => Promise.resolve()
};
