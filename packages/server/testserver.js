const path = require('path');
const { staticServer } = require('./src');

staticServer({
  artifactFilters: [/^loader\./],
  port: 3000,
  statsRoot: path.join(__dirname, '../../docs/app/data')
});
