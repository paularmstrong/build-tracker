const fs = require('fs');
const glob = require('glob');
const path = require('path');

exports.command = 'build';

exports.describe = 'Build the output report';

const usage = `Usage: $0 build -o <filename>

${exports.describe}.`;

exports.builder = yargs =>
  yargs.usage(usage).option('data', {
    alias: 'd',
    demandOption: true,
    normalize: true,
    type: 'array'
  });

const htmlPath = require.resolve('@build-tracker/app');

exports.handler = argv => {
  const data = argv.data.map(dataFile => {
    return JSON.parse(fs.readFileSync(dataFile).toString());
  });

  const jsFiles = glob.sync(`${path.resolve(htmlPath, '../static/js')}/*.js`);

  const html = fs.readFileSync(htmlPath).toString();
  let out = html.replace('<script id="data"></script>', `<script>window.DATA=${JSON.stringify(data)};</script>`);
  jsFiles.forEach(file => {
    const fileName = path.basename(file);
    const fileContents = fs.readFileSync(file);
    const re = new RegExp(`src="[\\w\\/]+${fileName}">`);
    out = out.replace(re, match => `>${fileContents.toString()}`);
  });
  console.log(out);
};
