/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Command from '../stat-artifacts';
import * as path from 'path';
import yargs from 'yargs';

describe('stat-artifacts command', () => {
  describe('builder', () => {
    test('defaults to no config', () => {
      const args = Command.builder(yargs([]));
      expect(args.argv).toEqual({
        $0: expect.any(String),
        _: [],
        o: true,
        out: true,
      });
    });
  });

  describe('handler', () => {
    describe('out', () => {
      test('writes the artifact stats to stdout', () => {
        const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementationOnce(() => true);
        return Command.handler({
          config: path.join(
            path.dirname(require.resolve('@build-tracker/fixtures')),
            'cli-configs/rc/.build-trackerrc.js'
          ),
          out: true,
        }).then(() => {
          expect(JSON.parse(writeSpy.mock.calls[writeSpy.mock.calls.length - 1][0])).toEqual({
            '../../fakedist/main.1234567.js': expect.objectContaining({
              stat: 65,
              gzip: 74,
              hash: '764196c430cf8a94c698b74b6dfdad71',
              // NOTE: if brotli is available, it will appear here
            }),
            '../../fakedist/test-folder/test-no-extension': expect.objectContaining({
              gzip: 54,
              hash: '415dec15fc798bb79f499aeff00258fb',
              stat: 34,
              // NOTE: if brotli is available, it will appear here
            }),
            '../../fakedist/vendor.js': expect.objectContaining({
              stat: 83,
              gzip: 83,
              hash: '0b3bb1892728da2a8a5af73335a51f35',
              // NOTE: if brotli is available, it will appear here
            }),
          });
        });
      });
    });
  });
});
