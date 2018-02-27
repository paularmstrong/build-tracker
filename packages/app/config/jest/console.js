const ignoredErrorMatchers = ['HTMLCanvasElement.prototype.getContext'];

const ignoredWarningMatchers = [];

console.error = error => {
  if (ignoredErrorMatchers.some(matcher => error.toString().indexOf(matcher) !== -1)) {
    return;
  }
  throw new Error(error);
};

console.warn = warning => {
  if (ignoredWarningMatchers.some(matcher => warning.indexOf(matcher) !== -1)) {
    return;
  }
  throw new Error(warning);
};
