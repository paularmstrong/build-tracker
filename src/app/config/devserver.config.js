/**
 * Copyright (c) 2019 Paul Armstrong
 */
const fakeBuild = require('@build-tracker/fixtures/builds/01141f29743fb2bdd7e176cf919fc964025cea5a.json');

module.exports = {
  dev: true,
  port: 3000,
  queries: {
    build: {
      byRevision: () => Promise.resolve(fakeBuild)
    },
    builds: {
      byRevisions: () => Promise.resolve([fakeBuild]),
      byRevisionRange: () => Promise.resolve([fakeBuild]),
      byTimeRange: () => Promise.resolve([fakeBuild])
    }
  }
};
