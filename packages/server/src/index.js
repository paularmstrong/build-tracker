// @flow
import bodyParser from 'body-parser';
import express from 'express';
import glob from 'glob';
import morgan from 'morgan';
import path from 'path';

import type { $Application, $Request, $Response } from 'express';

const APP_HTML_PATH = require.resolve('bundle-sleuth-app');

const app = express();
app.use(bodyParser.json());

const logFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms';

app.use(morgan(logFormat));
app.use(express.static(path.dirname(APP_HTML_PATH)));

export type ServerOptions = {
  getBuilds: ({}) => Promise<any>,
  insertBuild: ({}) => Promise<any>,
  port?: number
};

export default function createServer({ getBuilds, insertBuild, port = 3000 }: ServerOptions) {
  app.get('/api/builds', (req: $Request, res: $Response) => {
    getBuilds(req.query).then(data => {
      console.log('got data', data.length);
      res.write(JSON.stringify(data));
      res.end();
    });
  });

  app.post('/api/builds', (req: $Request, res: $Response) => {
    insertBuild(req.body)
      .then(() => {
        res.write(JSON.stringify({ success: true }));
        res.end();
      })
      .catch(err => {
        res.status(400);
        res.write(JSON.stringify({ success: false, error: err.toString() }));
        res.end();
      });
  });

  app.get('*', (req: $Request, res: $Response) => {
    res.sendFile(path.join(APP_HTML_PATH));
  });

  app.listen(port);
  console.log(`Application running on port ${port}`);
}

export type StaticServerOptions = {
  port?: number,
  statsRoot: string
};

export const staticServer = ({ port, statsRoot }: StaticServerOptions) => {
  const getBuilds = () => {
    return new Promise((resolve, reject) => {
      glob(`${statsRoot}/*.json`, (err, matches) => {
        if (err) {
          return reject(err);
        }

        const stats = matches
          .map(match => require(match))
          .sort((a, b) => new Date(b.meta.timestamp) - new Date(a.meta.timestamp));
        resolve(stats);
      });
    });
  };

  return createServer({
    getBuilds,
    insertBuild: () => Promise.reject(new Error('Static server cannot save new builds')),
    port
  });
};
