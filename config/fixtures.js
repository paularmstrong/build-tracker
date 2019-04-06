const glob = require('glob');
const path = require('path');
const { UnimplementedError } = require('@build-tracker/api-errors');
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

const builds = new Map();
glob.sync(`${path.join(__dirname, '../src/fixtures/builds')}/*.json`).forEach(fileName => {
  const build = require(fileName);
  builds.set(build.meta.revision.value || build.meta.revision, build);
});

module.exports = {
  dev: true,
  artifacts: {
    groups: [
      {
        name: 'Entries',
        artifactMatch: /^\w+$/,
        budgets: [{ level: BudgetLevel.ERROR, sizeKey: 'gzip', type: BudgetType.SIZE, maximum: 250000 }]
      },
      {
        name: 'Home',
        artifactNames: ['main', 'vendor', 'shared', 'runtime', 'bundle.HomeTimeline'],
        budgets: [{ level: BudgetLevel.ERROR, sizeKey: 'gzip', type: BudgetType.SIZE, maximum: 350000 }]
      }
    ]
  },
  queries: {
    build: {
      byRevision: async revision => {
        return Promise.resolve(builds.get(revision));
      },
      insert: async () => {
        throw new UnimplementedError();
      }
    },
    builds: {
      byRevisions: async (...revisions) => {
        return Promise.resolve(Array.from(builds.values()).filter(build => revisions.includes(build.meta.revision)));
      },
      byRevisionRange: async () => {
        throw new UnimplementedError();
      },
      byTimeRange: async (startTimestamp, endTimestamp) => {
        return Promise.resolve(
          Array.from(builds.values())
            .filter(build => build.meta.timestamp >= startTimestamp && build.meta.timestamp <= endTimestamp)
            .sort((a, b) => a.meta.timestamp - b.meta.timestamp)
        );
      },
      recent: async (limit = 20) => {
        return Promise.resolve(
          Array.from(builds.values())
            .sort((a, b) => a.meta.timestamp - b.meta.timestamp)
            .slice(-limit)
        );
      }
    }
  },
  setup: () => Promise.resolve(),
  url: 'http://localhost:3000'
};
