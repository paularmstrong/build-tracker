/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as VersionCommand from '../version';
import packageJson from '../../../package.json';
import yargs from 'yargs';

describe('version command', () => {
  describe('builder', () => {
    test('returns the config', () => {
      const args = VersionCommand.builder(yargs([]));
      expect(args.argv).toMatchObject({ _: [] });
    });
  });

  describe('handler', () => {
    test('runs the server with the given config', () => {
      const mockWrite = jest.spyOn(process.stdout, 'write').mockImplementationOnce(() => true);
      VersionCommand.handler();
      expect(mockWrite).toHaveBeenCalledWith(`${packageJson.version}\n`);
    });
  });
});
