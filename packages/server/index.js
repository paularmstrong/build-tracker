const express = require('express');
const glob = require('glob');
const morgan = require('morgan');
const path = require('path');

const app = express();

const logFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms';

const server = props => {
  const port = props.port || 3000;
  const get = props.get;

  app.use(morgan(logFormat));
  app.use(express.static(path.join(__dirname, '/../webapp/build')));

  app.get('/api/get.json', (req, res) => {
    const data = get(req.query);
    res.write(JSON.stringify(data));
    res.end();
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../webapp/build/index.html'));
  });

  app.listen(port);
  console.log(`Application running at http://localhost:${port}`);
};

server.staticFileServer = props => {
  glob(`${props.statsLocation}/*.json`, (err, matches) => {
    const stats = matches
      .map(match => require(match))
      .sort((a, b) => new Date(b.meta.timestamp) - new Date(a.meta.timestamp));
    return server(
      Object.assign({}, props, {
        get: query => {
          return stats;
        }
      })
    );
  });
};

module.exports = server;
