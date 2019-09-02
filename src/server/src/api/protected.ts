/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AuthError } from '@build-tracker/api-errors';
import { NextFunction, Request, Response } from 'express';

export default function(req: Request, res: Response, next: NextFunction): void {
  const authHeaderValue = req.headers['x-bt-auth'];
  const authToken = process.env.BT_API_AUTH_TOKEN;

  if (req.method === 'GET' || !authToken) {
    next();
    return;
  }

  if (!authHeaderValue) {
    res.status(401).send({ error: new AuthError(`${req.path} request x-bt-auth header`) });
    return;
  }

  if (authHeaderValue !== authToken) {
    res.status(401).send({ error: new AuthError('invalid auth token') });
    return;
  }

  next();
}
