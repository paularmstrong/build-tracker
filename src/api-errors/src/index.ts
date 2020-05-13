/**
 * Copyright (c) 2019 Paul Armstrong
 */

export class AuthError extends Error {
  status = 401;

  constructor(message?: string) {
    super(`Unauthorized access${message ? `: ${message}` : ''}`);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class NotFoundError extends Error {
  status = 404;

  constructor(message?: string) {
    super(`No builds found${message ? `: ${message}` : ''}`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnimplementedError extends Error {
  status = 501;

  constructor(message?: string) {
    super(`Method not implemented${message ? `: ${message}` : ''}`);
    Object.setPrototypeOf(this, UnimplementedError.prototype);
  }
}

export class ValidationError extends Error {
  status = 400;

  constructor(field: string, expected: string, received: string | number | void) {
    super(`"${field}" expected to receive "${expected}", but value was "${received}"`);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
