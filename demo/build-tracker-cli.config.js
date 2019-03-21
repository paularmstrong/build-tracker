const path = require('path');

const repoRoot = path.join(__dirname, '..');

module.exports = {
  applicationUrl: 'https://salty-dusk-69127.herokuapp.com/',
  artifacts: ['src/*/dist/**/*.js', 'plugins/*/dist/**/*.js'],
  baseDir: repoRoot,
  cwd: repoRoot,
  filenameHash: fileName => {
    const parts = path.basename(fileName, '.js').split('.');
    return parts.length > 1 ? parts[parts.length - 1] : null;
  },
  nameMapper: fileName => {
    return fileName.replace(/\.js$/, '').replace(/(plugins|src|dist)\//g, '');
  }
};
