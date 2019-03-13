/**
 * Copyright (c) 2019 Paul Armstrong
 */
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
