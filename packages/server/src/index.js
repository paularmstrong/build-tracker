// @flow
import * as Builds from './api/builds';
import bodyParser from 'body-parser';
import { BuildMeta } from '@build-tracker/builds';
import express from 'express';
import fs from 'fs';
import glob from 'glob';
import morgan from 'morgan';
import path from 'path';
import type { $Request, $Response } from 'express';
import type { BT$ArtifactFilters, BT$Build, BT$Thresholds } from '@build-tracker/types';
import type { BuildGetOptions, BuildPostCallbacks, BuildPostOptions, GetBuildsOptions } from './api/builds';

const APP_HTML = require.resolve('@build-tracker/app');

const app = express();
app.use(bodyParser.json());

const logFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms';

app.use(morgan(logFormat));

export type ServerOptions = {
  artifactFilters?: BT$ArtifactFilters,
  builds: BuildGetOptions & BuildPostOptions,
  callbacks?: BuildPostCallbacks,
  port?: number,
  thresholds?: BT$Thresholds
};

const defaultThresholds = {
  stat: 5000,
  statPercent: 0.1,
  gzip: 500,
  gzipPercent: 0.05
};

export default function createServer({
  artifactFilters = [],
  builds,
  callbacks,
  port = 3000,
  thresholds
}: ServerOptions) {
  app.get('/api/builds', Builds.handleGet(builds));
  app.post('/api/builds', Builds.handlePost(builds, callbacks));

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
            thresholds: { ...defaultThresholds, ...thresholds }
          })};</script>`
        );
        res.send(modifiedHtml);
      });
    }
  });

  app.listen(port);
  console.log(`Application running at http://localhost:${port}`);
}

export type StaticServerOptions = {
  artifactFilters?: BT$ArtifactFilters,
  port?: number,
  statsRoot: string,
  thresholds?: BT$Thresholds
};

export const staticServer = (options: StaticServerOptions) => {
  const getWithGlob = (match, branch, limit): Promise<Array<BT$Build>> => {
    return new Promise((resolve, reject) => {
      glob(`${options.statsRoot}/${match}.json`, (err, matches) => {
        if (err) {
          return reject(err);
        }

        const builds = matches
          .map(match => require(match))
          .filter((build: BT$Build) => !branch || BuildMeta.getBranch(build) === branch)
          .sort((a, b) => BuildMeta.getDate(b) - BuildMeta.getDate(a))
          .slice(0, limit);
        resolve(builds);
      });
    });
  };

  const getBuilds = (options: GetBuildsOptions) =>
    getWithGlob('*', options.branch, options.limit).then(builds =>
      builds.filter(build => {
        if (options.startTime && options.endTime) {
          // $FlowFixMe
          return options.startTime <= build.meta.timestamp && options.endTime >= build.meta.timestamp;
        }
        return true;
      })
    );

  const getByRevisions = revisions => getWithGlob(`*+(${revisions.join('|')})*`);

  return createServer({
    ...options,
    builds: {
      getBuilds,
      getByRevisions,
      getPrevious: () => Promise.reject(new Error('Not implemented')),
      insert: () => Promise.reject(new Error('Static server cannot save new builds'))
    }
  });
};
