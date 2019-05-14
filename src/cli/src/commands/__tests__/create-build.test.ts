/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Command from '../create-build';
import * as Git from '../../modules/git';
import * as path from 'path';
import yargs from 'yargs';

const config = path.join(
  path.dirname(require.resolve('@build-tracker/fixtures')),
  'cli-configs/rc/.build-trackerrc.js'
);

describe('create-build', () => {
  describe('builder', () => {
    test('defaults config', () => {
      const args = Command.builder(yargs([]));
      expect(args.argv).toEqual({
        $0: expect.any(String),
        _: [],
        o: true,
        out: true,
        'skip-dirty-check': false,
        skipDirtyCheck: false
      });
    });
  });

  describe('handler', () => {
    test('writes the artifact stats to stdout', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementationOnce(() => true);
      jest.spyOn(Git, 'getDefaultBranch').mockReturnValue(Promise.resolve('master'));
      jest.spyOn(Git, 'getParentRevision').mockReturnValue(Promise.resolve('1234567'));
      jest.spyOn(Git, 'getCurrentRevision').mockReturnValue(Promise.resolve('abcdefg'));
      jest
        .spyOn(Git, 'getRevisionDetails')
        .mockReturnValue(Promise.resolve({ timestamp: 1234567890, name: 'Jimmy', subject: 'tacos' }));

      return Command.handler({ config, out: true, 'skip-dirty-check': true }).then(() => {
        expect(writeSpy).toHaveBeenCalledWith(expect.stringMatching('\\"parentRevision\\": \\"1234567\\"'));
      });
    });

    test('allows skipping the git worktree check', () => {
      jest.spyOn(Git, 'isDirty').mockReturnValue(Promise.resolve(true));
      jest.spyOn(Git, 'getDefaultBranch').mockReturnValue(Promise.resolve('master'));
      jest.spyOn(Git, 'getParentRevision').mockReturnValue(Promise.resolve('1234567'));
      jest.spyOn(Git, 'getCurrentRevision').mockReturnValue(Promise.resolve('abcdefg'));
      jest
        .spyOn(Git, 'getRevisionDetails')
        .mockReturnValue(Promise.resolve({ timestamp: 1234567890, name: 'Jimmy', subject: 'tacos' }));

      return Command.handler({ config, out: false, 'skip-dirty-check': true }).then(res => {
        expect(res).toEqual(expect.any(Object));
      });
    });

    test('throws if the working tree is dirty', () => {
      jest.spyOn(Git, 'isDirty').mockReturnValue(Promise.resolve(true));
      return Command.handler({ config, out: false, 'skip-dirty-check': false }).catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual('Current work tree is dirty. Please commit all changes before proceeding');
      });
    });

    test('returns a JSON representation of a build', () => {
      jest.spyOn(Git, 'getDefaultBranch').mockReturnValue(Promise.resolve('master'));
      jest.spyOn(Git, 'getBranch').mockReturnValue(Promise.resolve('tacobranch'));
      jest.spyOn(Git, 'getParentRevision').mockReturnValue(Promise.resolve('1234567'));
      jest.spyOn(Git, 'getCurrentRevision').mockReturnValue(Promise.resolve('abcdefg'));
      jest
        .spyOn(Git, 'getRevisionDetails')
        .mockReturnValue(Promise.resolve({ timestamp: 1234567890, name: 'Jimmy', subject: 'tacos' }));

      return Command.handler({ config, out: false, 'skip-dirty-check': true }).then(res => {
        expect(res).toMatchObject({
          meta: {
            branch: 'tacobranch',
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
