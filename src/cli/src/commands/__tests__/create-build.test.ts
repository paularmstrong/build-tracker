/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as brotliSize from 'brotli-size';
import * as Command from '../create-build';
import * as Git from '../../modules/git';
import * as path from 'path';
import yargs from 'yargs';

const config = path.join(
  path.dirname(require.resolve('@build-tracker/fixtures')),
  'cli-configs/rc/.build-trackerrc.js'
);

const configWithFormatUrl = path.join(
  path.dirname(require.resolve('@build-tracker/fixtures')),
  'cli-configs/rc/.build-tracker-build-url-rc.js'
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
    let isDirtySpy, getBranchSpy, writeSpy;
    beforeEach(() => {
      writeSpy = jest.spyOn(process.stdout, 'write').mockImplementationOnce(() => true);
      isDirtySpy = jest.spyOn(Git, 'isDirty').mockImplementation(() => Promise.resolve(false));
      jest.spyOn(Git, 'getDefaultBranch').mockImplementation(() => Promise.resolve('master'));
      jest.spyOn(Git, 'getMergeBase').mockImplementation(() => Promise.resolve('1234567'));
      jest.spyOn(Git, 'getParentRevision').mockImplementation(() => Promise.resolve('7654321'));
      jest.spyOn(Git, 'getCurrentRevision').mockImplementation(() => Promise.resolve('abcdefg'));
      getBranchSpy = jest.spyOn(Git, 'getBranch').mockImplementation(() => Promise.resolve('master'));
      jest
        .spyOn(Git, 'getRevisionDetails')
        .mockImplementation(() => Promise.resolve({ timestamp: 1234567890, name: 'Jimmy', subject: 'tacos' }));
      jest.spyOn(brotliSize, 'sync').mockImplementation(() => 49);
    });

    test('writes the artifact stats to stdout', async () => {
      await expect(Command.handler({ config, out: true, 'skip-dirty-check': true })).resolves.toEqual(
        expect.any(Object)
      );
      expect(writeSpy).toHaveBeenCalledWith(expect.stringMatching('\\"parentRevision\\": \\"7654321\\"'));
    });

    test('gets parent revision if branch is same as default branch', async () => {
      await expect(Command.handler({ config, out: false, 'skip-dirty-check': true })).resolves.toMatchObject({
        meta: { parentRevision: '7654321' }
      });
    });

    test('gets the merge base if not on the default branch', async () => {
      getBranchSpy.mockReturnValue(Promise.resolve('tacos'));
      await expect(Command.handler({ config, out: false, 'skip-dirty-check': true })).resolves.toMatchObject({
        meta: { parentRevision: '1234567' }
      });
    });

    test('uses the provided parent-revision', async () => {
      await expect(
        Command.handler({ config, out: false, 'parent-revision': 'abcdefg', 'skip-dirty-check': true })
      ).resolves.toMatchObject({
        meta: { parentRevision: 'abcdefg' }
      });
    });

    test('allows overriding the git branch name check', async () => {
      isDirtySpy.mockReturnValue(Promise.resolve(true));

      await expect(
        Command.handler({ branch: 'burritos', config, out: false, 'skip-dirty-check': true })
      ).resolves.toMatchObject({ meta: expect.objectContaining({ branch: 'burritos' }) });
      expect(getBranchSpy).not.toHaveBeenCalled();
    });

    test('allows skipping the git worktree check', async () => {
      jest.spyOn(Git, 'isDirty').mockReturnValue(Promise.resolve(true));

      await expect(Command.handler({ config, out: false, 'skip-dirty-check': true })).resolves.toEqual(
        expect.any(Object)
      );
    });

    test('throws if the working tree is dirty', async () => {
      jest.spyOn(Git, 'isDirty').mockReturnValue(Promise.resolve(true));
      await expect(
        Command.handler({ config, out: false, 'skip-dirty-check': false })
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Current work tree is dirty. Please commit all changes before proceeding"`
      );
    });

    test('returns a JSON representation of a build', async () => {
      getBranchSpy.mockReturnValue(Promise.resolve('tacobranch'));

      await expect(Command.handler({ config, out: false, 'skip-dirty-check': true })).resolves.toMatchObject({
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
            hash: '415dec15fc798bb79f499aeff00258fb',
            name: '../../fakedist/test-folder/test-no-extension',
            sizes: {
              brotli: 49,
              gzip: 54,
              stat: 34
            }
          },
          {
            hash: 'fc4bcd175441f89862f9d81e37599416',
            name: '../../fakedist/vendor.js',
            sizes: {
              brotli: 49,
              gzip: 82,
              stat: 82
            }
          }
        ]
      });
    });

    test('returns a revision and parentRevision url if buildUrlFormat is provided', async () => {
      getBranchSpy.mockReturnValue(Promise.resolve('tacobranch'));

      await expect(
        Command.handler({ config: configWithFormatUrl, out: false, 'skip-dirty-check': true })
      ).resolves.toMatchObject({
        meta: {
          revision: { url: 'https://github.com/paularmstrong/build-tracker/commit/abcdefg', value: 'abcdefg' },
          parentRevision: { url: 'https://github.com/paularmstrong/build-tracker/commit/1234567', value: '1234567' }
        }
      });
    });

    test('can include JSON encoded extra meta', async () => {
      await expect(
        Command.handler({
          config,
          out: false,
          meta: '{"foo":"bar","baz":{"url":"https://buildtracker.dev","value":"baz"}}',
          'skip-dirty-check': true
        })
      ).resolves.toMatchObject({
        meta: { revision: 'abcdefg', foo: 'bar', baz: { url: 'https://buildtracker.dev', value: 'baz' } }
      });
    });
  });
});
