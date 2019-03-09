/**
 * Copyright (c) 2019 Paul Armstrong
 */
const chalk = require('chalk');

const clearOutput = () => {
  process.stdout.write('\x1B[2J\x1B[0f');
};

module.exports = port => ({
  change: (context, { shortPath }) => {
    clearOutput();
    console.log(`⏱  ${shortPath} changed. Rebuilding…`);
  },

  done: (context, { stats }) => {
    const info = stats.toJson();

    if (stats.hasErrors()) {
      info.errors.forEach(error => {
        console.error(error);
      });
    }
  },

  afterAllDone: context => {
    const { hasErrors, message, name } = context.state;

    if (hasErrors) {
      console.log(`\n 🚨 Server is ready on https://localhost:${port}, but may not work correctly\n`);
      console.error(`${chalk.red(name)}: ${message}`);
    } else {
      clearOutput();
      console.log(`\n 🚀 Server is ready on https://localhost:${port}\n`);
    }
  }
});
