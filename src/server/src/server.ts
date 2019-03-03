/**
 * Copyright (c) 2019 Paul Armstrong
 */
import api from './api';
import bodyParser from 'body-parser';
import express from 'express';
import expressPino from 'express-pino-logger';
import pino from 'pino';
import { Handlers, Queries } from './types';

export interface ServerConfig {
  queries: Queries;
  handlers?: Handlers;
  port?: number;
}

const app = express();
const logger = pino();
const reqLogger = expressPino({ logger });

export default function runBuildTracker(config: ServerConfig): void {
  const { handlers, port = 3000, queries } = config;
  app.use(reqLogger);
  app.use(bodyParser.json());

  app.use(api(express.Router(), queries, handlers));

  app.listen(port);
  logger.info(`Build Tracker server running on port ${port}`);
}
