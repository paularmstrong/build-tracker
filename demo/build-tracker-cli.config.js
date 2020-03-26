const path = require('path');

const repoRoot = path.join(__dirname, '..');

const filenameHash = (fileName) => {
  const parts = path.basename(fileName, '.js').split('.');
  return parts.length > 1 ? parts[parts.length - 1] : null;
};

module.exports = {
  applicationUrl: 'https://build-tracker-demo.herokuapp.com',
  artifacts: ['src/*/dist/**/*.js', 'plugins/*/dist/**/*.js'],
  baseDir: repoRoot,
  cwd: repoRoot,
  filenameHash,
  buildUrlFormat: 'https://github.com/paularmstrong/build-tracker/commit/:revision',
  nameMapper: (fileName) => {
    const hash = filenameHash(fileName);
    let out = fileName.replace(/\.js$/, '').replace(/(plugins|src|dist)\//g, '');
    return hash ? out.replace(`.${hash}`, '') : out;
  },
  onCompare: ({ markdown }) => {
    console.log(markdown);
    return Promise.resolve();
  },
};
