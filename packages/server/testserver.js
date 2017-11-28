const path = require('path');
const { staticServer } = require('./dist');

staticServer({
  port: 8888,
  statsRoot: path.join(__dirname, 'fixtures/stats')
});
