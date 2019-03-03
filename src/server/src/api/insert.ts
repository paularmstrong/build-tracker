/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import { Queries } from '../types';
import { Request, RequestHandler, Response } from 'express';

export const insertBuild = (
  getParent: Queries['build']['byRevision'],
  onInserted: (comparator: Comparator) => Promise<void> = () => Promise.resolve()
): RequestHandler => (req: Request, res: Response): void => {
  const { artifacts, meta } = req.body;
  const build = new Build(meta, artifacts);
  getParent(build.getMetaValue('parentRevision'))
    .then(parentBuild => {
      return new Comparator({ builds: [build, new Build(parentBuild.meta, parentBuild.artifacts)] });
    })
    .then(onInserted)
    .then(() => {
      res.send({ foo: 'bar' });
    });
};
