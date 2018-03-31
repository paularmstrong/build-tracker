const path = require('path');
const { staticServer } = require('./src');

staticServer({
  appConfig: {
    artifactFilters: [/^loader\./],
    routing: 'hash',
    toggleGroups: { boot: ['main', 'vendor', 'shared', 'runtime', 'bundle.HomeTimeline'] }
  },
  port: 3000,
  statsRoot: path.join(__dirname, 'fixtures/stats')
});
