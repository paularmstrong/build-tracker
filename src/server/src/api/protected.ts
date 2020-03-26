/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AuthError } from '@build-tracker/api-errors';
import { NextFunction, Request, Response } from 'express';

export default function (req: Request, res: Response, next: NextFunction): void {
  const authHeaderValue = req.headers['x-bt-auth'];
  const authToken = process.env.BT_API_AUTH_TOKEN;

  if (req.method === 'GET' || !authToken) {
    next();
    return;
  }

  if (!authHeaderValue) {
    const error = new AuthError(
      `${req.path} requires the x-bt-auth header to be set. This API is secured with a token, ensure you set the same BT_API_AUTH_TOKEN variable before requesting again`
    );
    res.status(error.status).send({ error: error.message });
    return;
  }

  if (authHeaderValue !== authToken) {
    const error = new AuthError('invalid x-bt-auth token header');
    res.status(error.status).send({ error: error.message });
    return;
  }

  next();
}
