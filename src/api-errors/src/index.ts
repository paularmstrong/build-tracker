/**
 * Copyright (c) 2019 Paul Armstrong
 */

export class AuthError extends Error {
  public readonly status = 401;

  public constructor(message?: string) {
    super(`Unauthorized access${message ? `: ${message}` : ''}`);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class NotFoundError extends Error {
  public readonly status = 404;

  public constructor(message?: string) {
    super(`No builds found${message ? `: ${message}` : ''}`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnimplementedError extends Error {
  public readonly status = 501;

  public constructor(message?: string) {
    super(`Method not implemented${message ? `: ${message}` : ''}`);
    Object.setPrototypeOf(this, UnimplementedError.prototype);
  }
}
