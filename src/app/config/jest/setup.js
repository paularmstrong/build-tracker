/**
 * Copyright (c) 2019 Paul Armstrong
 */
process.on('unhandledRejection', error => {
  console.log(error);
});

console.error = (...args) => {
  throw new Error(`Console error, ${args.join(' ')}`);
};
