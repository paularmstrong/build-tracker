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
  const { artifacts: artifactConfig = {}, budgets } = config;
  const build = new Build(meta, artifacts);
  queries
    .insert(build)
    .then(() =>
      queries
        .byRevision(build.getMetaValue('parentRevision'))
        .then(
          parentBuildData => {
            const parentBuild = new Build(parentBuildData.meta, parentBuildData.artifacts);
            return [parentBuild, build];
          },
          error => {
            if (error instanceof NotFoundError) {
              return [build];
            } else {
              throw error;
            }
          }
        )
        .then(builds => ({
          comparator: new Comparator({
            artifactBudgets: artifactConfig.budgets,
            artifactFilters: artifactConfig.filters,
            builds,
            budgets,
            groups: artifactConfig.groups
          })
        }))
        .then(context => {
          return onInserted(context.comparator).then(() => context);
        })
        .then(({ comparator }) => {
          res.send({
            comparatorData: comparator.serialize(),
            summary: comparator.toSummary()
          });
        })
    )
    .catch(error => {
      res.send({ error: error });
    });
};
