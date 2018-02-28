// @flow
import * as Builds from './api/builds';
import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs';
import glob from 'glob';
import morgan from 'morgan';
import path from 'path';
import type { $Request, $Response } from 'express';
import type { BuildGetOptions, BuildPostCallbacks, BuildPostOptions } from './api/builds';

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

const defaultBT$Thresholds = {
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
            thresholds: Object.assign({}, defaultBT$Thresholds, thresholds)
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
  const getWithGlob = (match, branch, count): Promise<Array<BT$Build>> => {
    return new Promise((resolve, reject) => {
      glob(`${options.statsRoot}/${match}.json`, (err, matches) => {
        if (err) {
          return reject(err);
        }

        const builds = matches
          .map(match => require(match))
          .filter((build: BT$Build) => !branch || build.meta.branch === branch)
          .sort((a, b) => new Date(b.meta.timestamp) - new Date(a.meta.timestamp))
          .slice(0, count);
        resolve(builds);
      });
    });
  };

  const getByBranch = (branch: string, count?: number) => getWithGlob('*', branch, count);

  const getByRevisions = revisions => getWithGlob(`*+(${revisions.join('|')})*`);
  const getByTimeRange = ({ startTime, endTime, branch }: { startTime: number, endTime?: number, branch?: string }) =>
    getWithGlob('*', branch).then((builds: Array<BT$Build>) => {
      return builds.filter(build => {
        return startTime <= build.meta.timestamp && (!endTime || endTime >= build.meta.timestamp);
      });
    });

  return createServer(
    Object.assign({}, options, {
      builds: {
        getByBranch,
        getByRevisions,
        getByTimeRange,
        getPrevious: () => Promise.reject('Not implemented'),
        insert: () => Promise.reject(new Error('Static server cannot save new builds'))
      }
    })
  );
};
