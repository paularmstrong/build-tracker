const glob = require('glob');
const path = require('path');
const subDays = require('date-fns/sub_days');
const { UnimplementedError } = require('@build-tracker/api-errors');

module.exports = (fixtureType, overrides = {}) => {
  const builds = new Map();
  const today = new Date();
  glob
    .sync(`${path.join(__dirname, `../src/fixtures/builds-${fixtureType}`)}/*.json`)
    .map(buildPath => ({ ...require(buildPath) }))
    .sort((a, b) => b.meta.timestamp - a.meta.timestamp)
    .forEach((build, i) => {
      build.meta.timestamp = Math.floor(subDays(today, i).valueOf() / 1000);
      builds.set(build.meta.revision.value || build.meta.revision, build);
    });

  return {
    dev: true,
    defaultSizeKey: 'gzip',
    name: 'Static Fixtures',
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
        byRevisions: async revisions => {
          return Promise.resolve(revisions.map(revision => builds.get(revision)).filter(Boolean));
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
    url: 'http://localhost:3000',
    ...overrides
  };
};
