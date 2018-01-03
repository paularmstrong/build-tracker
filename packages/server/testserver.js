const path = require('path');
const { staticServer } = require('./src');

staticServer({
  artifactFilters: [/^loader\./],
  port: 8888,
  statsRoot: path.join(__dirname, 'fixtures/stats')
});
