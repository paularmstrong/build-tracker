/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as path from 'path';
import * as RunCommand from '../run';
import yargs from 'yargs';

describe('run command', () => {
  describe('builder', () => {
    test('defaults to no config', () => {
      const args = RunCommand.builder(yargs([]));
      expect(args.argv).toEqual({
        $0: expect.any(String),
        _: []
      });
    });
  });

  describe('handler', () => {
    describe('config', () => {
      test('found via cosmiconfig when not provided', () => {
        jest
          .spyOn(process, 'cwd')
          .mockReturnValue(path.join(path.dirname(require.resolve('@build-tracker/fixtures')), 'cli-configs/commonjs'));
        return RunCommand.handler({}).then(result => {
          expect(result).toMatchObject({
            configPath: path.join(
              path.dirname(require.resolve('@build-tracker/fixtures')),
              'cli-configs/commonjs/build-tracker.config.js'
            )
          });
        });
      });

      test('loaded via cosmiconfig when provided', () => {
        return RunCommand.handler({
          config: path.join(
            path.dirname(require.resolve('@build-tracker/fixtures')),
            'cli-configs/rc/.build-trackerrc.js'
          )
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
        return RunCommand.handler({ config: 'tacos' }).catch(e => {
          expect(e.message).toMatch('Could not find configuration file');
        });
      });
    });
  });
});
