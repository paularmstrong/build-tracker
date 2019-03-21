/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as path from 'path';
import * as RunCommand from '../run';
import * as Server from '../../server';
import express from 'express';
import yargs from 'yargs';

describe('run command', () => {
  describe('builder', () => {
    test('looks for the config in the process working directory', () => {
      jest
        .spyOn(process, 'cwd')
        .mockReturnValue(path.join(path.dirname(require.resolve('@build-tracker/fixtures')), 'server-configs'));

      const args = RunCommand.builder(yargs([]));
      expect(args.argv.config).toEqual(
        require.resolve('@build-tracker/fixtures/server-configs/build-tracker.config.js')
      );
    });

    test('resolves the config path for requires', () => {
      jest.spyOn(process, 'cwd').mockReturnValue(path.join(__dirname, '../../..'));

      const args = RunCommand.builder(yargs(['--config', './fixtures/server-configs/build-tracker.config.js']));
      expect(args.argv.config).toEqual(
        path.join(__dirname, '../../../fixtures/server-configs/build-tracker.config.js')
      );
    });
  });

  describe('handler', () => {
    test('runs the server with the given config', () => {
      jest.spyOn(Server, 'default').mockImplementation(() => express());
      const configPath = require.resolve('@build-tracker/fixtures/server-configs/build-tracker.config.js');
      RunCommand.handler({ config: configPath });
      expect(Server.default).toHaveBeenCalledWith(require(configPath));
    });
  });
});
