const path = require('path');
const { staticFileServer } = require('./');

staticFileServer({
  statsLocation: path.join(__dirname, 'src/stats'),
  port: 8888
});
