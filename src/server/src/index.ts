#!/usr/bin/env Node
/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as path from 'path';
import yargs from 'yargs';

const argv = yargs
  .usage('$0 <cmd> [args]')
  .help('help', 'Show this help screen')
  .alias('help', 'h')
  .wrap(Math.min(process.stdout.columns, 120))
  .recommendCommands()
  .option('v', {
    default: 0,
    describe: 'Set the logging verbosity. Use -vv for more verbose',
    global: true,
    type: 'count'
  })
  .group(['help', 'verbose'], 'Global:')
  .commandDir(path.join(__dirname, 'commands'), {
    extensions: ['ts', 'js']
  })
  .demandCommand(1, 1, 'Please provide a command to run').argv;

/* eslint-disable no-console */
argv.v >= 2 && console.debug(argv);
