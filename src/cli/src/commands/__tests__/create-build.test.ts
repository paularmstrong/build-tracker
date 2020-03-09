/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as brotliSize from 'brotli-size';
import * as Command from '../create-build';
import path from 'path';
import yargs from 'yargs';

const config = path.join(
  path.dirname(require.resolve('@build-tracker/fixtures')),
  'cli-configs/rc/.build-trackerrc.js'
);

describe('create-build', () => {
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
      expect(writeSpy).toHaveBeenCalledWith(expect.stringMatching('"name": "../../fakedist/main.1234567.js"'));
    });

    test('converts JSON string-encoded metadata', async () => {
      await expect(
        Command.handler({ config, meta: JSON.stringify({ foo: 'bar' }), out: true, 'skip-dirty-check': true })
      ).resolves.toBeUndefined();
      expect(writeSpy).toHaveBeenCalledWith(expect.stringMatching('\\"foo\\": \\"bar\\"'));
    });
  });
});
