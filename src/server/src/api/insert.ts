/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppConfig } from '@build-tracker/types';
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import { NotFoundError } from '@build-tracker/api-errors';
import { Queries } from '../types';
import { Request, RequestHandler, Response } from 'express';

export const insertBuild = (
  queries: Queries['build'],
  appConfig: AppConfig,
  onInserted: (comparator: Comparator) => Promise<void> = () => Promise.resolve()
): RequestHandler => (req: Request, res: Response): void => {
  const { artifacts, meta } = req.body;
  const build = new Build(meta, artifacts);
  queries.insert(build).then(() =>
    queries
      .byRevision(build.getMetaValue('parentRevision'))
      .then(parentBuild => {
        return new Comparator({
          artifactBudgets: appConfig.artifacts.budgets,
          artifactFilters: appConfig.artifacts.filters,
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
