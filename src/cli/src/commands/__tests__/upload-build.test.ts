/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Command from '../upload-build';
import yargs from 'yargs';

describe('upload-build', () => {
  describe('builder', () => {
    test('defaults config', () => {
      const args = Command.builder(yargs([]));
      expect(args.argv).toEqual({
        $0: expect.any(String),
        _: [],
        'skip-dirty-check': false,
        skipDirtyCheck: false,
      });
    });
  });
});
