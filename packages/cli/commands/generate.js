const crypto = require('crypto');
const fs = require('fs');
const glob = require('glob');
const gzip = require('gzip-size');
const path = require('path');

exports.command = 'generate';

exports.describe = 'Generate stats for a build';

const usage = `Usage: $0 ${exports.command} [options]

${exports.describe}.`;

exports.builder = yargs =>
  yargs
    .usage(usage)
    .option('dir', {
      alias: 'd',
      describe: 'Directory to find artifacts',
      demandOption: true,
      normalize: true,
      type: 'string'
    })
    .option('glob', {
      alias: 'g',
      describe: 'Glob string to match artifacts',
      demandOption: true,
      type: 'array'
    })
    .option('filename-template', {
      alias: 'f',
      describe: 'Regular expression for matching the name of the file',
      type: 'string'
    })
    .option('meta.revision', {
      describe: 'Revision of the build',
      type: 'string'
    })
    .option('meta.branch', {
      describe: 'Branch of the build',
      type: 'string'
    })
    .option('pretty', {
      alias: 'p',
      describe: 'Pretty-print the JSON',
      type: 'boolean'
    });

exports.handler = argv => {
  const filenameMatcher = argv['filename-template'] ? new RegExp(argv['filename-template']) : /(.+)\.[^.]+$/;
  const assets = [].concat.apply([], argv.glob.map(pattern => glob.sync(`${argv.dir}/${pattern}`)));
  const artifacts = assets.reduce((artifacts, assetPath) => {
    const source = fs.readFileSync(assetPath);
    const hash = crypto.createHash('md5');
    const assetFilename = path.basename(assetPath);
    const name = assetFilename.match(filenameMatcher);
    const matchedName = name[1];
    return Object.assign({}, artifacts, {
      [matchedName]: {
        hash: hash.update(source).digest('hex'),
        name: matchedName,
        stat: Buffer.byteLength(source, 'utf8'),
        gzip: gzip.sync(source)
      }
    });
  }, {});

  const build = {
    meta: Object.assign({}, { timestamp: new Date().valueOf() }, argv.meta),
    artifacts
  };

  console.log(JSON.stringify(build, null, argv.pretty ? 2 : 0));
};
