/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as VersionCommand from '../version';
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
      const mockWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
      VersionCommand.handler();
      expect(mockWrite.mock.calls[0][0]).toMatchInlineSnapshot(`
"1.0.0
"
`);
    });
  });
});
