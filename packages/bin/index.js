#!/usr/bin/env node

const path = require('path');

require('yargs')
  .usage(`Usage: $0 build --data build-1.json --data build-2.json [...]`)
  .help('help', 'Show this help screen')
  .alias('help', 'h')
  .wrap(Math.min(process.stdout.columns, 120))
  .recommendCommands()
  .commandDir(path.join(__dirname, 'commands'))
  .demandCommand(1, 1, 'Please provide a command to run').argv;
