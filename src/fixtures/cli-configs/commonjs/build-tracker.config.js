const path = require('path');

module.exports = {
  applicationUrl: '',
  artifacts: ['../fakedist/*.js'],
  baseDir: path.resolve(__dirname, 'fakedist'),
  cwd: __dirname,
  filenameHash: fileName => {
    const parts = path.basename(fileName, '.js').split('.');
    return parts.length > 1 ? parts[parts.length - 1] : null;
  },
  nameMapper: fileName => {
    return path.basename(fileName, '.js');
  }
};
