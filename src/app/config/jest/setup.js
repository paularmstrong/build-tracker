/**
 * Copyright (c) 2019 Paul Armstrong
 */
process.on('unhandledRejection', error => {
  console.error(error);
});

const ignoredErrors = [/An update to [^ ]+ inside a test was not wrapped in act/];

console.error = (...args) => {
  if (ignoredErrors.some(err => err.test(args[0]))) {
    return;
  }
  throw new Error(`Console error, ${args.join(' ')}`);
};
