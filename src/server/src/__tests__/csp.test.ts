/**
 * Copyright (c) 2019 Paul Armstrong
 */
import getCSP from '../csp';

describe('CSP', () => {
  test('gets the nonce from a function', () => {
    expect(getCSP()).toMatchObject({
      scriptSrc: ["'self'", "'strict-dynamic'", expect.any(Function)]
    });

    // @ts-ignore
    expect(getCSP().scriptSrc[2]({}, { locals: { nonce: '12345' } })).toEqual("'nonce-12345'");
  });

  test('sets unsafe-eval only if explicitly told', () => {
    expect(getCSP(true)).toMatchObject({
      scriptSrc: ["'self'", "'unsafe-eval'", "'strict-dynamic'", expect.any(Function)]
    });
  });
});
