/**
 * Copyright (c) 2019 Paul Armstrong
 */
process.on('unhandledRejection', (error) => {
  console.error(error);
});

const ignoredErrors = [
  /An update to [^ ]+ inside a test was not wrapped in act/,
  /Warning: useLayoutEffect does nothing on the server/,
];

console.error = (...args) => {
  if (ignoredErrors.some((err) => err.test(args[0]))) {
    return;
  }
  throw new Error(`Console error, ${args.join(' ')}`);
};

const ignoredWarnings = [/Warning: \w+ has been renamed, and is not recommended for use. See https:\/\/fb\.me/];
const consoleWarn = console.warn.bind(console);

console.warn = (...args) => {
  if (ignoredWarnings.some((warning) => warning.test(args[0]))) {
    return;
  }
  consoleWarn(...args);
};
