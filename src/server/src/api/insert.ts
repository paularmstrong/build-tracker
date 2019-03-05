/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppConfig } from '@build-tracker/types';
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import { Queries } from '../types';
import { Request, RequestHandler, Response } from 'express';

export const insertBuild = (
  getParent: Queries['build']['byRevision'],
  appConfig: AppConfig,
  onInserted: (comparator: Comparator) => Promise<void> = () => Promise.resolve()
): RequestHandler => (req: Request, res: Response): void => {
  const { artifacts, meta } = req.body;
  const build = new Build(meta, artifacts);
  getParent(build.getMetaValue('parentRevision'))
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
    });
};
