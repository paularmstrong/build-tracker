const express = require('express');
const path = require('path');

const app = express();

const server = props => {
  const appPath = props.appPath || '';
  const port = props.port || 3000;
  const get = props.get;

  app.use(express.static(path.join(__dirname, 'build')));

  app.get(`${appPath}/_api_/get`, (req, res) => {
    const data = get(req.query);
    res.write(JSON.stringify(data));
    res.end();
  });

  app.get(`${appPath}*`, (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
  });

  app.listen(port);
  console.log(`Application running at http://localhost:${port}${appPath}`);
};

server.staticFileServer = props => {
  const stats = glob(`${props.statsLocation}/*.json`, (err, matches) => {
    // TODO: read files and join as big stats object
    return server({
      ...props,
      get: query => {
        return {};
      }
    });
  });
};

module.exports = server;
