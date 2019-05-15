/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Queries } from '../types';
import { ServerConfig } from '../server';
import { Request, RequestHandler, Response } from 'express';

const DEFAULT_BRANCH = 'master';

export const queryByRevision = (queries: Queries['build']): RequestHandler => (req: Request, res: Response): void => {
  const { revision } = req.params;
  queries
    .byRevision(revision)
    .then(build => {
      res.send(build);
    })
    .catch(error => {
      res.status(error.status || 500);
      res.send({ error: error.message });
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
    .catch(error => {
      res.status(error.status || 500);
      res.send({ error: error.message });
    });
};

export const queryByTimeRange = (queries: Queries['builds'], config: ServerConfig): RequestHandler => (
  req: Request,
  res: Response
): void => {
  const { startTimestamp, endTimestamp } = req.params;
  const { branch } = req.query;
  queries
    .byTimeRange(
      parseInt(startTimestamp, 10),
      parseInt(endTimestamp, 10),
      branch || config.defaultBranch || DEFAULT_BRANCH
    )
    .then(builds => {
      res.send(builds);
    })
    .catch(error => {
      res.status(error.status || 500);
      res.send({ error: error.message });
    });
};

export const queryByRevisions = (queries: Queries['builds']): RequestHandler => (req: Request, res: Response): void => {
  const { 0: revisions } = req.params;
  queries
    .byRevisions(revisions.split('/'))
    .then(builds => {
      res.send(builds);
    })
    .catch(error => {
      res.status(error.status || 500);
      res.send({ error: error.message });
    });
};

export const queryByRecent = (queries: Queries['builds'], config: ServerConfig): RequestHandler => (
  req: Request,
  res: Response
): void => {
  const { limit } = req.params;
  const { branch } = req.query;
  queries
    .recent(limit ? parseInt(limit, 10) : undefined, branch || config.defaultBranch || DEFAULT_BRANCH)
    .then(builds => {
      res.send(builds);
    })
    .catch(error => {
      res.status(error.status || 500);
      res.send({ error: error.message });
    });
};
