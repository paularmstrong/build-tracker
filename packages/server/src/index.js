// @flow
import assert from 'assert';
import bodyParser from 'body-parser';
import BuildComparator from 'build-tracker-comparator';
import express from 'express';
import glob from 'glob';
import morgan from 'morgan';
import path from 'path';

import type { $Application, $Request, $Response } from 'express';

export type BuildMeta = {
  revision: string,
  timestamp: number
};

export type Artifact = {|
  hash: string,
  name: string,
  size: number,
  gzipSize: number
|};

export type Build = {|
  meta: BuildMeta,
  artifacts: { [name: string]: Artifact }
|};

const noop = () => {};

const APP_HTML_PATH = require.resolve('build-tracker-app');

const app = express();
app.use(bodyParser.json());

const logFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms';

app.use(morgan(logFormat));
app.use(express.static(path.dirname(APP_HTML_PATH)));

export type ServerOptions = {
  getBuilds: ({}) => Promise<Array<Build>>,
  insertBuild: ({}) => Promise<any>,
  onBuildInserted?: (comparator: typeof BuildComparator) => void,
  port?: number
};

export type NormalizedQuery = {
  startTime?: number,
  endTime?: number,
  count?: number
};

const normalizeQuery = (query: {}): NormalizedQuery => {
  return Object.keys(query).reduce((memo: NormalizedQuery, key) => {
    const value = query[key];
    switch (key) {
      case 'startTime':
      case 'endTime':
      case 'count':
        memo[key] = parseInt(value, 10);
        break;
      case 'startRevision':
      case 'endRevision':
        memo[key] = `${value}`;
        break;
      // no default
    }
    return memo;
  }, {});
};

const isValidBuild = data => {
  assert(data.meta && typeof data.meta === 'object', 'Metadata is provided');
  assert(data.meta.revision && typeof data.meta.revision === 'string', 'Build revision is provided');
  assert(data.meta.timestamp && typeof data.meta.timestamp === 'number', 'Build timestamp is provided');
  assert(data.artifacts && typeof data.artifacts === 'object', 'Build artifacts are provided');
  Object.keys(data.artifacts).forEach(key => {
    const artifact = data.artifacts[key];
    assert(artifact.name, `Name is provided for artifact ${key}`);
    assert(artifact.size, `Size is provided for artifact ${key}`);
  });
};

export default function createServer({ getBuilds, insertBuild, onBuildInserted, port = 3000 }: ServerOptions) {
  app.get('/api/builds', (req: $Request, res: $Response) => {
    getBuilds(normalizeQuery(req.query)).then(data => {
      res.write(JSON.stringify(data));
      res.end();
    });
  });

  app.post('/api/builds', (req: $Request, res: $Response) => {
    const build = req.body;
    try {
      isValidBuild(build);
    } catch (err) {
      res.status(400);
      res.write(JSON.stringify({ success: false, error: err.toString() }));
      res.end();
      return;
    }

    insertBuild(build)
      .then(() => {
        res.write(JSON.stringify({ success: true }));
      })
      .then(() => getBuilds({ limit: 1, timeRange: { to: build.meta.timestamp - 1 } }))
      .then((builds: Array<Build>) => {
        const comparator = new BuildComparator([...builds, build]);
        onBuildInserted && onBuildInserted(comparator);
      })
      .then(() => {
        res.end();
      })
      .catch(err => {
        res.status(400);
        res.write(JSON.stringify({ success: false, error: err.toString() }));
        res.end();
      });
  });

  app.get('*', (req: $Request, res: $Response) => {
    res.sendFile(APP_HTML_PATH);
  });

  app.listen(port);
  console.log(`Application running on port ${port}`);
}

export type StaticServerOptions = {
  port?: number,
  statsRoot: string
};

export const staticServer = ({ port, statsRoot }: StaticServerOptions) => {
  const getBuilds = args => {
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
