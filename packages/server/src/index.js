// @flow
import * as Branches from './api/branches';
import * as Builds from './api/builds';
import assert from 'assert';
import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs';
import glob from 'glob';
import morgan from 'morgan';
import path from 'path';

import type { $Application, $Request, $Response } from 'express';
import type { BranchGetOptions } from './api/branches';
import type { BuildGetOptions, BuildPostOptions, BuildPostCallbacks } from './api/builds';

import type { Artifact, $ArtifactFilters, Build, BuildMeta, $Thresholds } from 'build-tracker-flowtypes';

const noop = () => {};

const APP_HTML = require.resolve('build-tracker-app');

const app = express();
app.use(bodyParser.json());

const logFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms';

app.use(morgan(logFormat));

export type ServerOptions = {
  artifactFilters?: $ArtifactFilters,
  branches: BranchGetOptions,
  builds: BuildGetOptions & BuildPostOptions,
  callbacks?: BuildPostCallbacks,
  port?: number,
  thresholds?: $Thresholds
};

const defaultThresholds = {
  stat: 5000,
  statPercent: 0.1,
  gzip: 500,
  gzipPercent: 0.05
};

export default function createServer({
  artifactFilters = [],
  branches,
  builds,
  callbacks,
  port = 3000,
  thresholds
}: ServerOptions) {
  app.get('/api/builds', Builds.handleGet(builds));
  app.post('/api/builds', Builds.handlePost(builds, callbacks));

  app.get('/api/branches', Branches.handleGet(branches));

  app.get('/static/*', (req: $Request, res: $Response) => {
    res.sendFile(path.join(path.dirname(APP_HTML), req.path));
  });

  app.get('*', (req: $Request, res: $Response) => {
    if (/\.[a-z]{2,4}$/.test(req.path)) {
      res.sendFile(path.join(path.dirname(APP_HTML), req.path));
    } else {
      fs.readFile(APP_HTML, (err, data) => {
        if (err) {
          res.sendStatus(404);
          return;
        }

        const modifiedHtml = data.toString().replace(
          '<script id="config"></script>',
          `<script id="config">window.CONFIG=${JSON.stringify({
            artifactFilters: artifactFilters.map(filter => filter.toString()),
            thresholds: Object.assign({}, defaultThresholds, thresholds)
          })};</script>`
        );
        res.send(modifiedHtml);
      });
    }
  });

  app.listen(port);
  console.log(`Application running on port ${port}`);
}

export type StaticServerOptions = {
  artifactFilters?: $ArtifactFilters,
  port?: number,
  statsRoot: string,
  thresholds?: $Thresholds
};

const unique = (value, index, self): boolean => self.indexOf(value) === index;

export const staticServer = ({ port, statsRoot, thresholds }: StaticServerOptions) => {
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
    port,
    thresholds
  });
};
