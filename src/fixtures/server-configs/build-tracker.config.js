/**
 * Copyright (c) 2019 Paul Armstrong
 */
const fakeBuild = require('../builds-medium/01141f29743fb2bdd7e176cf919fc964025cea5a.json');

module.exports = {
  getParentBuild: () => Promise.resolve(fakeBuild),
  port: 3000,
  setup: () => Promise.resolve(),
};
