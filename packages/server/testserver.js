const path = require('path');
const { staticFileServer } = require('./');

staticFileServer({
  statsLocation: path.join(__dirname, 'fixtures/stats'),
  port: 8888
});
