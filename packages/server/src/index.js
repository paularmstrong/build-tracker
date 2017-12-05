// @flow
import * as Branches from './api/branches';
import * as Builds from './api/builds';
import assert from 'assert';
import bodyParser from 'body-parser';
import BuildComparator from 'build-tracker-comparator';
import express from 'express';
import glob from 'glob';
import morgan from 'morgan';
import path from 'path';

import type { $Application, $Request, $Response } from 'express';
import type { BranchGetOptions } from './api/branches';
import type { BuildGetOptions, BuildPostOptions } from './api/builds';

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
  branches: BranchGetOptions,
  builds: BuildGetOptions & BuildPostOptions,
  callbacks?: {
    onBuildInserted?: (comparator: typeof BuildComparator) => void
  },
  port?: number
};

export default function createServer({ branches, builds, callbacks, port = 3000 }: ServerOptions) {
  app.get('/api/builds', Builds.handleGet(builds));
  app.post('/api/builds', Builds.handlePost(builds, callbacks));

  app.get('/api/branches', Branches.handleGet(branches));

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

const unique = (value, index, self): boolean => self.indexOf(value) === index;

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

  const getByBranch = (branch?: string, count?: number) => getWithGlob('*', branch, count);
  const getByRevisions = revisions => getWithGlob(`*+(${revisions.join('|')})*`);
  const getBranches = (count?: number) =>
    getWithGlob('*').then((builds: Array<Build>) => {
      const branches = builds
        .map((build: Build) => build.meta.branch)
        .filter(unique)
        .sort();
      const masterIndex = branches.indexOf('master');
      if (masterIndex) {
        branches.splice(masterIndex, 1);
        branches.unshift('master');
      }
      return branches.slice(0, count);
    });

  return createServer({
    branches: {
      getBranches
    },
    builds: {
      getByBranch,
      getByRevisionRange: () => Promise.reject('Not implemented'),
      getByRevisions,
      getByTimeRange: () => Promise.reject('Not implemented'),
      getPrevious: () => Promise.reject('Not implemented'),
      insert: () => Promise.reject(new Error('Static server cannot save new builds'))
    },
    port
  });
};
