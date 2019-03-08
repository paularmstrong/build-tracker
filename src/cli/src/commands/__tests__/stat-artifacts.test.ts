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
        out: true
      });
    });
  });

  describe('handler', () => {
    describe('config', () => {
      test('found via cosmiconfig when not provided', () => {
        jest
          .spyOn(process, 'cwd')
          .mockReturnValue(path.join(path.dirname(require.resolve('@build-tracker/fixtures')), 'cli-configs/commonjs'));
        return Command.handler({ out: false }).then(result => {
          expect(result).toMatchObject({
            configPath: path.join(
              path.dirname(require.resolve('@build-tracker/fixtures')),
              'cli-configs/commonjs/build-tracker.config.js'
            )
          });
        });
      });

      test('loaded via cosmiconfig when provided', () => {
        return Command.handler({
          config: path.join(
            path.dirname(require.resolve('@build-tracker/fixtures')),
            'cli-configs/rc/.build-trackerrc.js'
          ),
          out: false
        }).then(result => {
          expect(result).toMatchObject({
            configPath: path.join(
              path.dirname(require.resolve('@build-tracker/fixtures')),
              'cli-configs/rc/.build-trackerrc.js'
            )
          });
        });
      });

      test('throws if no configuration found', () => {
        return Command.handler({ config: 'tacos', out: false }).catch(e => {
          expect(e.message).toMatch('Could not find configuration file');
        });
      });
    });

    describe('out', () => {
      test('writes the artifact stats to stdou', () => {
        const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
        return Command.handler({
          config: path.join(
            path.dirname(require.resolve('@build-tracker/fixtures')),
            'cli-configs/rc/.build-trackerrc.js'
          ),
          out: true
        }).then(() => {
          expect(writeSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
"{
  \\"../../fakedist/main.1234567.js\\": {
    \\"hash\\": \\"631a500f31d7602a386b4f858338dd6f\\",
    \\"stat\\": 64,
    \\"gzip\\": 73,
    \\"brotli\\": 49
  },
  \\"../../fakedist/vendor.js\\": {
    \\"hash\\": \\"fc4bcd175441f89862f9d81e37599416\\",
    \\"stat\\": 82,
    \\"gzip\\": 82,
    \\"brotli\\": 62
  }
}"
`);
        });
      });
    });
  });
});
