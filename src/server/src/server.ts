/**
 * Copyright (c) 2019 Paul Armstrong
 */
import api from './api';
import { AppConfig } from '@build-tracker/types';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import expressPino from 'express-pino-logger';
import getCSP from './csp';
import helmet from 'helmet';
import path from 'path';
import pino from 'pino';
import express, { NextFunction, Request, Response } from 'express';
import { Handlers, Queries } from './types';

export interface ServerConfig extends AppConfig {
  dev?: boolean;
  handlers?: Handlers;
  port?: number;
  setup?: () => Promise<boolean>;
  queries: Queries;
  url: string;
}

const app = express();
const logger = pino();
const reqLogger = expressPino({ logger });

export default function runBuildTracker(config: ServerConfig): void {
  const { handlers, port = 3000, queries, url } = config;
  const IN_DEV = process.env.NODE_ENV !== 'production' && config.dev;
  app.use(reqLogger);
  app.use(bodyParser.json());

  app.use(api(express.Router(), queries, config, handlers));

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    res.locals.url = url;
    next();
  });

  app.use(helmet.contentSecurityPolicy({ directives: getCSP(IN_DEV) }));

  const APP_ROOT = path.dirname(require.resolve('@build-tracker/app'));

  if (IN_DEV) {
    const middleware = require('webpack-dev-middleware');
    const webpack = require('webpack');
    const compiler = webpack(require(path.join(APP_ROOT, 'config/webpack.config'))({ port }));
    app.use(middleware(compiler, { noInfo: true, publicPath: '/', serverSideRender: true }));
    app.use(require('webpack-hot-middleware')(compiler.compilers.find(compiler => compiler.name === 'client')));
    app.use(require('webpack-hot-server-middleware')(compiler));
  } else {
    const serverRenderer = require(path.join(APP_ROOT, 'dist/server/main')).default;
    const stats = require(path.join(APP_ROOT, 'dist/stats.json'));
    app.use(express.static(path.join(APP_ROOT, 'dist')));
    app.use(serverRenderer(stats));
  }

  app.listen(port);
  logger.info(`Build Tracker server running on port ${port}`);
}
