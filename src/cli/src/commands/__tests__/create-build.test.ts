/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as brotliSize from 'brotli-size';
import * as Command from '../create-build';
import * as Git from '@build-tracker/api-client/src/modules/git';
import path from 'path';
import yargs from 'yargs';

const config = path.join(
  path.dirname(require.resolve('@build-tracker/fixtures')),
  'cli-configs/rc/.build-trackerrc.js'
);

describe('create-build', () => {
  beforeEach(() => {
    jest.spyOn(Git, 'getDefaultBranch').mockImplementation(() => Promise.resolve('master'));
    jest.spyOn(Git, 'getMergeBase').mockImplementation(() => Promise.resolve('1234567'));
    jest.spyOn(Git, 'getParentRevision').mockImplementation(() => Promise.resolve('7654321'));
    jest.spyOn(Git, 'getCurrentRevision').mockImplementation(() => Promise.resolve('abcdefg'));
    jest.spyOn(Git, 'getBranch').mockImplementation(() => Promise.resolve('master'));
    jest
      .spyOn(Git, 'getRevisionDetails')
      .mockImplementation(() => Promise.resolve({ timestamp: 1234567890, name: 'Jimmy', subject: 'tacos' }));
  });

  describe('builder', () => {
    test('defaults config', () => {
      const args = Command.builder(yargs([]));
      expect(args.argv).toEqual({
        $0: expect.any(String),
        _: [],
        o: true,
        out: true,
        'skip-dirty-check': false,
        skipDirtyCheck: false
      });
    });
  });

  describe('handler', () => {
    let writeSpy;
    beforeEach(() => {
      writeSpy = jest.spyOn(process.stdout, 'write').mockImplementationOnce(() => true);
      jest.spyOn(brotliSize, 'sync').mockImplementation(() => 49);
    });

    test('writes the artifact stats to stdout', async () => {
      await expect(Command.handler({ config, out: true, 'skip-dirty-check': true })).resolves.toBeUndefined();
      expect(writeSpy).toHaveBeenCalledWith(expect.stringMatching('"parentRevision": "7654321",'));
    });

    test('converts JSON string-encoded metadata', async () => {
      await expect(
        Command.handler({ config, meta: JSON.stringify({ foo: 'bar' }), out: true, 'skip-dirty-check': true })
      ).resolves.toBeUndefined();
      expect(writeSpy).toHaveBeenCalledWith(expect.stringMatching('\\"foo\\": \\"bar\\"'));
    });
  });
});
