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
  branch: string,
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
  getPreviousBuild: (timestamp: number) => Promise<Build>,
  getBuildsByTimeRange: (startTime: number, endTime?: number) => Promise<Array<Build>>,
  getBuildsForRevisions: (revisions: Array<string>) => Promise<Array<Build>>,
  getBuildsByRevisionRange: (startRevision: string, endRevision?: string) => Promise<Array<Build>>,
  getRecentBuilds: (branch?: string, limit?: number) => Promise<Array<Build>>,
  insertBuild: ({}) => Promise<any>,
  onBuildInserted?: (comparator: typeof BuildComparator) => void,
  port?: number
};

export type NormalizedQuery = {
  branch?: string,
  count?: number,
  endRevision?: string,
  endTime?: number,
  revisions?: Array<string>,
  startRevision?: string,
  startTime?: number
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
      case 'branch':
        memo[key] = `${value}`;
        break;
      default:
        memo[key] = value;
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

const createResponseWithJSON = res => data => {
  res.write(JSON.stringify(data));
};

export default function createServer({
  getPreviousBuild,
  getBuildsForRevisions,
  getBuildsByRevisionRange,
  getBuildsByTimeRange,
  getRecentBuilds,
  insertBuild,
  onBuildInserted,
  port = 3000
}: ServerOptions) {
  app.get('/api/builds', (req: $Request, res: $Response) => {
    const query = normalizeQuery(req.query);
    const respondWithJSON = data => {
      res.write(JSON.stringify(data));
      res.end();
    };
    if (query.revisions) {
      getBuildsForRevisions(query.revisions).then(respondWithJSON);
    } else if (query.startRevision) {
      getBuildsByRevisionRange(query.startRevision, query.endRevision).then(respondWithJSON);
    } else if (query.startTime) {
      getBuildsByTimeRange(query.startTime, query.endTime).then(respondWithJSON);
    } else {
      getRecentBuilds(query.branch || 'master', query.count).then(respondWithJSON);
    }
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
      .then(() => getPreviousBuild(build.meta.timestamp))
      .then((parentBuild: Build) => {
        const comparator = new BuildComparator([parentBuild, build].filter(Boolean));
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
  const getWithGlob = (match, branch, count): Promise<Array<Build>> => {
    return new Promise((resolve, reject) => {
      glob(`${statsRoot}/${match}.json`, (err, matches) => {
        if (err) {
          return reject(err);
        }

        const stats = matches
          .map(match => require(match))
          .sort((a, b) => new Date(b.meta.timestamp) - new Date(a.meta.timestamp))
          .slice(0, count);
        resolve(stats);
      });
    });
  };

  const getRecentBuilds = (branch?: string, count?: number) => getWithGlob('*', branch, count);
  const getBuildsForRevisions = revisions => getWithGlob(`*+(${revisions.join('|')})*`);

  return createServer({
    getBuildsForRevisions,
    getBuildsByRevisionRange: () => Promise.reject('Not implemented'),
    getBuildsByTimeRange: () => Promise.reject('Not implemented'),
    getPreviousBuild: () => Promise.reject('Not implemented'),
    getRecentBuilds,
    insertBuild: () => Promise.reject(new Error('Static server cannot save new builds')),
    port
  });
};
