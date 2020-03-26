/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as brotliSize from 'brotli-size';
import fs from 'fs';
import gzipSize from 'gzip-size';
import path from 'path';
import readfile from '../readfile';

const fixturePath = require.resolve('@build-tracker/fixtures');
const main = path.join(path.dirname(fixturePath), 'cli-configs/fakedist/main.1234567.js');

describe('readfile', () => {
  let brotliSizeMock;
  beforeEach(() => {
    // @ts-ignore
    jest.spyOn(fs, 'statSync').mockImplementationOnce(() => ({ size: 64 }));
    brotliSizeMock = jest.spyOn(brotliSize, 'sync').mockImplementationOnce(() => 49);
    jest.spyOn(gzipSize, 'sync').mockImplementationOnce(() => 73);
  });

  describe('hash', () => {
    test('defaults to an MD5 of the file', () => {
      expect(readfile(main).hash).toMatchInlineSnapshot(`"631a500f31d7602a386b4f858338dd6f"`);
    });

    test('can get the hash from filename function', () => {
      expect(
        readfile(main, (fileName: string): string => {
          return fileName.split('.')[1];
        })
      ).toMatchObject({
        hash: '1234567',
      });
    });
  });

  describe('sizes', () => {
    test('returns a stat size', () => {
      expect(readfile(main).stat).toEqual(64);
    });

    test('returns a gzip size', () => {
      expect(readfile(main).gzip).toEqual(73);
    });

    test('returns a brotli size', () => {
      expect(readfile(main).brotli).toEqual(49);
    });

    test('if brotli throws, does not fail', () => {
      brotliSizeMock.mockReset().mockImplementationOnce(() => {
        throw new Error('not implemented');
      });
      expect(readfile(main)).not.toMatchObject({ brotli: expect.any(Number) });
    });
  });
});
