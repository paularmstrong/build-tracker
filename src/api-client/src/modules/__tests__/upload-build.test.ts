/**
 * Copyright (c) 2019 Paul Armstrong
 */
import config from '@build-tracker/fixtures/cli-configs/rc/.build-trackerrc.js';
import httpConfig from '@build-tracker/fixtures/cli-configs/rc/.build-tracker-http-rc.js';
import nock from 'nock';
import uploadBuild from '../upload-build';

const build = {
  meta: {
    branch: 'master',
    revision: '1234567',
    parentRevision: 'abcdefg',
    timestamp: 1234567
  },
  artifacts: []
};

const returnValue = {
  comparatorData: '',
  summary: []
};

describe('uploadBuild', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('uploads the current build', async () => {
    nock(`${config.applicationUrl}/`)
      .post('/api/builds')
      .reply(200, returnValue);

    await expect(uploadBuild(config, build)).resolves.toEqual(returnValue);
  });

  test('uses the input logger', async () => {
    const logger = { log: jest.fn(), error: jest.fn() };
    nock(`${config.applicationUrl}/`)
      .post('/api/builds')
      .reply(200, returnValue);

    await expect(uploadBuild(config, build, undefined, logger)).resolves.toEqual(returnValue);
    expect(logger.log).toHaveBeenLastCalledWith(JSON.stringify(returnValue));
  });

  test('invokes `onCompare`', async () => {
    const onCompareSpy = jest.spyOn(config, 'onCompare').mockImplementationOnce(() => Promise.resolve());

    nock(`${config.applicationUrl}/`)
      .post('/api/builds')
      .reply(200, returnValue);

    await expect(uploadBuild(config, build)).resolves.toEqual(returnValue);
    expect(onCompareSpy).toHaveBeenCalledWith(returnValue);
  });

  test('if request failed, responds with error and does not invoke `onCompare`', async () => {
    const onCompareSpy = jest.spyOn(config, 'onCompare').mockImplementationOnce(() => Promise.resolve());

    nock(`${config.applicationUrl}/`)
      .post('/api/builds')
      .reply(500, { error: 'Something went wrong.' });

    await expect(uploadBuild(config, build)).rejects.toStrictEqual(new Error('Something went wrong.'));
    expect(onCompareSpy).not.toHaveBeenCalled();
  });

  test('uploads the current build over http', async () => {
    nock(`${httpConfig.applicationUrl}/`)
      .post('/api/builds')
      .reply(200, returnValue);

    await expect(uploadBuild(httpConfig, build)).resolves.toEqual(returnValue);
  });

  test('sends the BT_API_AUTH_TOKEN', async () => {
    nock(`${httpConfig.applicationUrl}/`)
      .matchHeader('x-bt-auth', 'test-token')
      .post('/api/builds')
      .reply(200, returnValue);

    await expect(uploadBuild(httpConfig, build, 'test-token')).resolves.toEqual(returnValue);
  });

  test('rejects on error response', async () => {
    const responseError = new Error('some error');

    nock(`${config.applicationUrl}/`)
      .post('/api/builds')
      .replyWithError(responseError);

    await expect(uploadBuild(config, build)).rejects.toBe(responseError);
  });

  test('uses the input error logger', async () => {
    const responseError = new Error('some error');
    const logger = { log: jest.fn(), error: jest.fn() };
    nock(`${config.applicationUrl}/`)
      .post('/api/builds')
      .replyWithError(responseError);

    await expect(uploadBuild(config, build, undefined, logger)).rejects.toEqual(responseError);
    expect(logger.error).toHaveBeenLastCalledWith(responseError.toString());
  });
});
