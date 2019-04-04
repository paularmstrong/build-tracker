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
    test('uploads the current build', () => {
      jest.spyOn(CreateBuild, 'handler').mockImplementation(() => Promise.resolve(postData));
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementationOnce(() => true);
      const configValues = require(config);

      nock(`${configValues.applicationUrl}/`, { allowUnmocked: true })
        .post('/api/builds')
        .reply(200, { success: 'yep' });

      return Command.handler({ config, out: true, 'skip-dirty-check': true }).then(() => {
        expect(writeSpy).toHaveBeenCalledWith('{"success":"yep"}');
      });
    });

    test('uploads the current build over http', () => {
      jest.spyOn(CreateBuild, 'handler').mockImplementation(() => Promise.resolve(postData));
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementationOnce(() => true);
      const configValues = require(httpConfig);

      nock(`${configValues.applicationUrl}/`, { allowUnmocked: true })
        .post('/api/builds')
        .reply(200, { success: 'yep' });

      return Command.handler({ config: httpConfig, out: true, 'skip-dirty-check': true }).then(() => {
        expect(writeSpy).toHaveBeenCalledWith('{"success":"yep"}');
      });
    });

    test('rejects on error response', () => {
      jest.spyOn(CreateBuild, 'handler').mockImplementation(() => Promise.resolve(postData));
      const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementationOnce(() => true);
      const configValues = require(config);

      const responseError = new Error('some error');

      nock(`${configValues.applicationUrl}/`, { allowUnmocked: true })
        .post('/api/builds')
        .replyWithError(responseError);

      return Command.handler({ config, out: true, 'skip-dirty-check': true }).catch(error => {
        expect(writeSpy).toHaveBeenCalledWith(responseError.toString());
        expect(error).toBe(responseError);
      });
    });
  });
});
