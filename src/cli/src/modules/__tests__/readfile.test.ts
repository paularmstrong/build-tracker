/**
 * Copyright (c) 2019 Paul Armstrong
 */
import path from 'path';
import readfile from '../readfile';

const fixturePath = require.resolve('@build-tracker/fixtures');
const main = path.join(path.dirname(fixturePath), 'cli-configs/fakedist/main.1234567.js');

describe('readfile', () => {
  describe('hash', () => {
    test('defaults to an MD5 of the file', () => {
      expect(readfile(main).hash).toMatchInlineSnapshot(`"631a500f31d7602a386b4f858338dd6f"`);
    });

    test('can get the hash from filename function', () => {
      expect(
        readfile(
          main,
          (fileName: string): string => {
            return fileName.split('.')[1];
          }
        )
      ).toMatchObject({
        hash: '1234567'
      });
    });
  });

  describe('sizes', () => {
    test('returns a stat size', () => {
      expect(readfile(main).stat).toMatchInlineSnapshot(`64`);
    });

    test('returns a gzip size', () => {
      expect(readfile(main).gzip).toMatchInlineSnapshot(`73`);
    });

    test('returns a brotli size', () => {
      expect(readfile(main).brotli).toMatchInlineSnapshot(`49`);
    });
  });
});
