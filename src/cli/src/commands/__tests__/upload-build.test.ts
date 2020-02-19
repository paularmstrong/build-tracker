/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Command from '../upload-build';
import * as CreateBuild from '../create-build';
import nock from 'nock';
import path from 'path';
import yargs from 'yargs';

const config = path.join(
  path.dirname(require.resolve('@build-tracker/fixtures')),
  'cli-configs/rc/.build-trackerrc.js'
);

const httpConfig = path.join(
  path.dirname(require.resolve('@build-tracker/fixtures')),
  'cli-configs/rc/.build-tracker-http-rc.js'
);

const postData = { meta: { revision: '12345', parentRevision: 'abcdef', timestamp: Date.now(), artifacts: [] } };

describe('upload-build', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('builder', () => {
    test('defaults config', () => {
      const args = Command.builder(yargs([]));
      expect(args.argv).toEqual({
        $0: expect.any(String),
        _: [],
        'skip-dirty-check': false,
        skipDirtyCheck: false
      });
    });
  });

  describe('handler', () => {
    test('uploads the current build', async () => {
      jest.spyOn(CreateBuild, 'handler').mockImplementation(() => Promise.resolve(postData));
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementationOnce(() => true);
      const configValues = require(config);

      nock(`${configValues.applicationUrl}/`)
        .post('/api/builds')
        .reply(200, { success: 'yep' });

      await expect(Command.handler({ config, out: true, 'skip-dirty-check': true })).resolves.toBeUndefined();
      expect(writeSpy).toHaveBeenCalledWith('{"success":"yep"}');
    });

    test('invokes `onCompare`', async () => {
      jest.spyOn(CreateBuild, 'handler').mockImplementation(() => Promise.resolve(postData));
      const configValues = require(config);
      const onCompareSpy = jest.spyOn(configValues, 'onCompare').mockImplementationOnce(() => Promise.resolve());

      nock(`${configValues.applicationUrl}/`)
        .post('/api/builds')
        .reply(200, { success: 'yep' });

      await expect(Command.handler({ config, out: true, 'skip-dirty-check': true })).resolves.toBeUndefined();
      expect(onCompareSpy).toHaveBeenCalledWith({ success: 'yep' });
    });

    test('if request failed, responds with error and does not invoke `onCompare`', async () => {
      jest.spyOn(CreateBuild, 'handler').mockImplementation(() => Promise.resolve(postData));
      const configValues = require(config);
      const onCompareSpy = jest.spyOn(configValues, 'onCompare').mockImplementationOnce(() => Promise.resolve());

      nock(`${configValues.applicationUrl}/`)
        .post('/api/builds')
        .reply(500, { error: {} });

      await expect(Command.handler({ config, out: true, 'skip-dirty-check': true })).rejects.toStrictEqual(
        new Error('Bad status code')
      );
      expect(onCompareSpy).not.toHaveBeenCalled();
    });

    test('uploads the current build over http', async () => {
      jest.spyOn(CreateBuild, 'handler').mockImplementation(() => Promise.resolve(postData));
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementationOnce(() => true);
      const configValues = require(httpConfig);

      nock(`${configValues.applicationUrl}/`)
        .post('/api/builds')
        .reply(200, { success: 'yep' });

      await expect(
        Command.handler({ config: httpConfig, out: true, 'skip-dirty-check': true })
      ).resolves.toBeUndefined();
      expect(writeSpy).toHaveBeenCalledWith('{"success":"yep"}');
    });

    test('sends the BT_API_AUTH_TOKEN', async () => {
      const prevToken = process.env.BT_API_AUTH_TOKEN;
      process.env.BT_API_AUTH_TOKEN = 'test-token';

      jest.spyOn(CreateBuild, 'handler').mockImplementation(() => Promise.resolve(postData));
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementationOnce(() => true);
      const configValues = require(httpConfig);

      nock(`${configValues.applicationUrl}/`)
        .matchHeader('x-bt-auth', 'test-token')
        .post('/api/builds')
        .reply(200, { success: 'yep' });

      await expect(
        Command.handler({ config: httpConfig, out: true, 'skip-dirty-check': true })
      ).resolves.toBeUndefined();
      expect(writeSpy).toHaveBeenCalledWith('{"success":"yep"}');
      process.env.BT_API_AUTH_TOKEN = prevToken;
    });

    test('rejects on error response', async () => {
      jest.spyOn(CreateBuild, 'handler').mockImplementation(() => Promise.resolve(postData));
      const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementationOnce(() => true);
      const configValues = require(config);

      const responseError = new Error('some error');

      nock(`${configValues.applicationUrl}/`)
        .post('/api/builds')
        .replyWithError(responseError);

      await expect(Command.handler({ config, out: true, 'skip-dirty-check': true })).rejects.toBe(responseError);
      expect(writeSpy).toHaveBeenCalledWith(responseError.toString());
    });
  });
});
