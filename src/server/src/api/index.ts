/**
 * Copyright (c) 2019 Paul Armstrong
 */
import express from 'express';
import { Handlers } from '../types';
import { insertBuild } from './insert';
import { ServerConfig } from '../server';
import { queryByRecent, queryByRevision, queryByRevisionRange, queryByRevisions, queryByTimeRange } from './read';

const defaultBuildInsert = (): Promise<void> => Promise.resolve();

const middleware = (router: express.Router, config: ServerConfig, handlers?: Handlers): express.Router => {
  const { onBuildInsert = defaultBuildInsert } = handlers || {};
  router.post('/api/builds', insertBuild(config.queries.build, config, onBuildInsert));
  router.get('/api/builds/:limit?', queryByRecent(config.queries.builds, config));
  router.get('/api/builds/range/:startRevision..:endRevision', queryByRevisionRange(config.queries.builds));
  router.get('/api/builds/time/:startTimestamp..:endTimestamp', queryByTimeRange(config.queries.builds, config));
  router.get('/api/builds/list/*', queryByRevisions(config.queries.builds));
  router.get('/api/build/:revision', queryByRevision(config.queries.build));
  return router;
};

export default middleware;
