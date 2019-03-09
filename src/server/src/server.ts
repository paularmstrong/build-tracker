/**
 * Copyright (c) 2019 Paul Armstrong
 */
import api from './api';
import { AppConfig } from '@build-tracker/types';
import bodyParser from 'body-parser';
import express from 'express';
import expressPino from 'express-pino-logger';
import path from 'path';
import pino from 'pino';
import { Handlers, Queries } from './types';

export interface ServerConfig extends AppConfig {
  dev?: boolean;
  handlers?: Handlers;
  port?: number;
  queries: Queries;
}

const app = express();
const logger = pino();
const reqLogger = expressPino({ logger });

export default function runBuildTracker(config: ServerConfig): void {
  const { handlers, port = 3000, queries } = config;
  app.use(reqLogger);
  app.use(bodyParser.json());

  app.use(api(express.Router(), queries, config, handlers));

  const APP_ROOT = path.dirname(require.resolve('@build-tracker/app'));

  if (process.env.NODE_ENV !== 'production' && config.dev) {
    const middleware = require('webpack-dev-middleware');
    const webpack = require('webpack');
    const compiler = webpack(require(path.join(APP_ROOT, '../config/webpack.config')));
    app.use(middleware(compiler, { publicPath: '/', serverSideRender: true }));
    app.use(require('webpack-hot-middleware')(compiler.compilers.find(compiler => compiler.name === 'client')));
    app.use(require('webpack-hot-server-middleware')(compiler));
  } else {
    const serverRenderer = require(path.join(APP_ROOT, 'server/main')).default;
    const stats = require(path.join(APP_ROOT, 'stats.json'));
    app.use(express.static(APP_ROOT));
    app.use(serverRenderer(stats));
  }

  app.listen(port);
  logger.info(`Build Tracker server running on port ${port}`);
}
