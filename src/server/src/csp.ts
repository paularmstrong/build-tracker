/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { IHelmetContentSecurityPolicyDirectives } from 'helmet';
import { Request, Response } from 'express';

const getNonce = (_req: Request, res: Response): string => `'nonce-${res.locals.nonce}'`;

const getCSP = (allowUnsafeEval: boolean = false): IHelmetContentSecurityPolicyDirectives => ({
  blockAllMixedContent: true,
  connectSrc: ["'self'"],
  childSrc: ["'self'"],
  defaultSrc: ["'self'"],
  fontSrc: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  frameSrc: ["'none'"],
  imgSrc: ["'self'"],
  manifestSrc: ["'self'"],
  mediaSrc: ["'self'"],
  objectSrc: ["'self'"],
  scriptSrc: ["'self'", allowUnsafeEval && "'unsafe-eval'", "'strict-dynamic'", getNonce].filter(Boolean),
  styleSrc: ["'self'", "'unsafe-inline'"],
  upgradeInsecureRequests: false,
  workerSrc: ["'self'"]
});

export default getCSP;
