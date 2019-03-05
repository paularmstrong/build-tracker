/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ArtifactBudgets } from '@build-tracker/types';
import express from 'express';
import { insertBuild } from './insert';
import { Handlers, Queries } from '../types';
import { queryByRevision, queryByRevisionRange, queryByRevisions, queryByTimeRange } from './read';

const middleware = (
  router: express.Router,
  queries: Queries,
  handlers: Handlers,
  budgets: ArtifactBudgets
): express.Router => {
  router.post('/api/builds', insertBuild(queries.build.byRevision, handlers.onBuildInsert, budgets));
  router.get('/api/builds/range/:startRevision..:endRevision', queryByRevisionRange(queries.builds));
  router.get('/api/builds/time/:startTimestamp..:endTimestamp', queryByTimeRange(queries.builds));
  router.get('/api/builds/list/*', queryByRevisions(queries.builds));
  router.get('/api/build/:revision', queryByRevision(queries.build));
  return router;
};

export default middleware;
