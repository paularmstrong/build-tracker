/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Command from '../create-build';
import * as Git from '../../modules/git';
import * as path from 'path';
import yargs from 'yargs';

describe('create-build', () => {
  describe('builder', () => {
    test('defaults config', () => {
      const args = Command.builder(yargs([]));
      expect(args.argv).toEqual({
        $0: expect.any(String),
        _: []
      });
    });
  });

  describe('handler', () => {
    test('throws if the working tree is dirty', () => {
      jest.spyOn(Git, 'isDirty').mockReturnValue(Promise.resolve(true));
      return Command.handler({}).catch(err => {
        expect(err).toMatchInlineSnapshot(`[TypeError: Cannot read property 'config' of null]`);
      });
    });

    test('returns a JSON representation of a build', () => {
      jest.spyOn(Git, 'isDirty').mockReturnValue(Promise.resolve(false));
      jest.spyOn(Git, 'getDefaultBranch').mockReturnValue(Promise.resolve('master'));
      jest.spyOn(Git, 'getParentRevision').mockReturnValue(Promise.resolve('1234567'));
      jest.spyOn(Git, 'getCurrentRevision').mockReturnValue(Promise.resolve('abcdefg'));
      jest
        .spyOn(Git, 'getRevisionDetails')
        .mockReturnValue(Promise.resolve({ timestamp: 1234567890, name: 'Jimmy', subject: 'tacos' }));

      return Command.handler({
        config: path.join(
          path.dirname(require.resolve('@build-tracker/fixtures')),
          'cli-configs/rc/.build-trackerrc.js'
        )
      }).then(res => {
        expect(res).toEqual({
          meta: {
            parentRevision: '1234567',
            revision: 'abcdefg',
            timestamp: 1234567890,
            author: 'Jimmy',
            subject: 'tacos'
          },
          artifacts: [
            {
              hash: '631a500f31d7602a386b4f858338dd6f',
              name: '../../fakedist/main.1234567.js',
              sizes: {
                brotli: 49,
                gzip: 73,
                stat: 64
              }
            },
            {
              hash: 'fc4bcd175441f89862f9d81e37599416',
              name: '../../fakedist/vendor.js',
              sizes: {
                brotli: 62,
                gzip: 82,
                stat: 82
              }
            }
          ]
        });
      });
    });
  });
});
