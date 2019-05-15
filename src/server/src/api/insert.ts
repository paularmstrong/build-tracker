/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import { NotFoundError } from '@build-tracker/api-errors';
import { Queries } from '../types';
import { ServerConfig } from '../server';
import { Request, RequestHandler, Response } from 'express';

export const insertBuild = (
  queries: Queries['build'],
  config: ServerConfig,
  onInserted: (comparator: Comparator) => Promise<void> = () => Promise.resolve()
): RequestHandler => (req: Request, res: Response): void => {
  const { artifacts, meta } = req.body;
  const { artifacts: artifactConfig = {} } = config;
  const build = new Build(meta, artifacts);
  queries.insert(build).then(() =>
    queries
      .byRevision(build.getMetaValue('parentRevision'))
      .then(parentBuild => {
        return new Comparator({
          artifactBudgets: artifactConfig.budgets,
          artifactFilters: artifactConfig.filters,
          builds: [build, new Build(parentBuild.meta, parentBuild.artifacts)]
        });
      })
      .then(comparator => {
        return onInserted(comparator).then(() => comparator);
      })
      .then(comparator => {
        res.send({
          comparator: comparator.toJSON()
        });
      })
      .catch(error => {
        if (error instanceof NotFoundError) {
          res.send({ error });
          return;
        }
        res.send({ error });
      })
  );
};
