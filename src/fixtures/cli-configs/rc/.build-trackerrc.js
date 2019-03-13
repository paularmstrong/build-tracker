const path = require('path');

module.exports = {
  applicationUrl: '',
  artifacts: ['../fakedist/*.js'],
  baseDir: path.resolve(__dirname, 'fakedist'),
  cwd: __dirname
};
