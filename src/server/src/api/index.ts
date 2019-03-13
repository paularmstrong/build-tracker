/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppConfig } from '@build-tracker/types';
import express from 'express';
import { insertBuild } from './insert';
import { Handlers, Queries } from '../types';
import { queryByRecent, queryByRevision, queryByRevisionRange, queryByRevisions, queryByTimeRange } from './read';

const defaultBuildInsert = (): Promise<void> => Promise.resolve();

const middleware = (
  router: express.Router,
  queries: Queries,
  appConfig: AppConfig,
  handlers?: Handlers
): express.Router => {
  const { onBuildInsert = defaultBuildInsert } = handlers || {};
  router.post('/api/builds', insertBuild(queries.build.byRevision, appConfig, onBuildInsert));
  router.get('/api/builds/:limit?', queryByRecent(queries.builds));
  router.get('/api/builds/range/:startRevision..:endRevision', queryByRevisionRange(queries.builds));
  router.get('/api/builds/time/:startTimestamp..:endTimestamp', queryByTimeRange(queries.builds));
  router.get('/api/builds/list/*', queryByRevisions(queries.builds));
  router.get('/api/build/:revision', queryByRevision(queries.build));
  return router;
};

export default middleware;
