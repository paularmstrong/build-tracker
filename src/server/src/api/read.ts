/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Queries } from '../types';
import { Request, RequestHandler, Response } from 'express';

export const queryByRevision = (queries: Queries['build']): RequestHandler => (req: Request, res: Response): void => {
  const { revision } = req.params;
  queries
    .byRevision(revision)
    .then(build => {
      res.send(build);
    })
    .catch(() => {
      res.status(500);
      res.end();
    });
};

export const queryByRevisionRange = (queries: Queries['builds']): RequestHandler => (
  req: Request,
  res: Response
): void => {
  const { startRevision, endRevision } = req.params;
  queries
    .byRevisionRange(startRevision, endRevision)
    .then(builds => {
      res.send(builds);
    })
    .catch(() => {
      res.status(500);
      res.end();
    });
};

export const queryByTimeRange = (queries: Queries['builds']): RequestHandler => (req: Request, res: Response): void => {
  const { startTimestamp, endTimestamp } = req.params;
  queries
    .byTimeRange(startTimestamp, endTimestamp)
    .then(builds => {
      res.send(builds);
    })
    .catch(() => {
      res.status(500);
      res.end();
    });
};

export const queryByRevisions = (queries: Queries['builds']): RequestHandler => (req: Request, res: Response): void => {
  const { 0: revisions } = req.params;
  queries
    .byRevisions(revisions.split('/'))
    .then(builds => {
      res.send(builds);
    })
    .catch(() => {
      res.status(500);
      res.end();
    });
};
