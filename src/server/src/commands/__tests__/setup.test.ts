/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Command from '../setup';
import * as path from 'path';
import yargs from 'yargs';

describe('run command', () => {
  describe('builder', () => {
    test('looks for the config in the process working directory', () => {
      jest
        .spyOn(process, 'cwd')
        .mockReturnValue(path.join(path.dirname(require.resolve('@build-tracker/fixtures')), 'server-configs'));

      const args = Command.builder(yargs([]));
      expect(args.argv.config).toEqual(
        require.resolve('@build-tracker/fixtures/server-configs/build-tracker.config.js')
      );
    });

    test('resolves the config path for requires', () => {
      jest.spyOn(process, 'cwd').mockReturnValue(path.join(__dirname, '../../..'));

      const args = Command.builder(yargs(['--config', './fixtures/server-configs/build-tracker.config.js']));
      expect(args.argv.config).toEqual(
        path.join(__dirname, '../../../fixtures/server-configs/build-tracker.config.js')
      );
    });
  });

  describe('handler', () => {
    test('runs the setup command for the config', () => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      const configPath = require.resolve('@build-tracker/fixtures/server-configs/build-tracker.config.js');
      const config = require(configPath);
      const setupSpy = jest.spyOn(config, 'setup');
      Command.handler({ config: configPath });
      expect(setupSpy).toHaveBeenCalled();
    });

    test('exits if no setup found', () => {
      const configPath = require.resolve('@build-tracker/fixtures/server-configs/build-tracker.config.js');
      const config = require(configPath);
      delete config.setup;
      expect(Command.handler({ config: configPath })).rejects.toThrow();
    });
  });
});
