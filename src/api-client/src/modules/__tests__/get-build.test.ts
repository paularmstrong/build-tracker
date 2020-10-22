/**
 * Copyright (c) 2019 Paul Armstrong
 */
import config from '@build-tracker/fixtures/cli-configs/rc/.build-trackerrc.js';
const fakeBuild = require('@build-tracker/fixtures/builds-medium/1bf811ec249c2b13a314e127312b2d760f6658e2.json');
import getBuild from '../get-build';
import nock from 'nock';
import { NotFoundError } from '@build-tracker/api-errors';

describe('getBuild', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('exist', () => {
    expect(getBuild).toBeDefined();
  });

  test('when found returns build', async () => {
    nock(`${config.applicationUrl}/`).get('/api/builds/1bf811ec249c2b13a314e127312b2d760f6658e2').reply(200, fakeBuild);

    await expect(getBuild(config, '1bf811ec249c2b13a314e127312b2d760f6658e2')).resolves.toMatchObject(fakeBuild);
  });

  test('when missing', async () => {
    nock(`${config.applicationUrl}/`).get('/api/builds/blah').reply(404, new NotFoundError());

    await expect(getBuild(config, 'blah')).rejects.toThrow(Error);
  });
});
