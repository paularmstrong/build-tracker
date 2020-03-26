/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as brotliSize from 'brotli-size';
import * as Git from '../../modules/git';
import config from '@build-tracker/fixtures/cli-configs/rc/.build-trackerrc.js';
import configWithFormatUrl from '@build-tracker/fixtures/cli-configs/rc/.build-tracker-build-url-rc.js';
import createBuild from '../create-build';

describe('createBuild', () => {
  let isDirtySpy, getBranchSpy;
  beforeEach(() => {
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

  test('gets parent revision if branch is same as default branch', async () => {
    await expect(createBuild(config, { skipDirtyCheck: true })).resolves.toMatchObject({
      meta: { parentRevision: '7654321' },
    });
  });

  test('gets the merge base if not on the default branch', async () => {
    getBranchSpy.mockReturnValue(Promise.resolve('tacos'));
    await expect(createBuild(config, { skipDirtyCheck: true })).resolves.toMatchObject({
      meta: { parentRevision: '1234567' },
    });
  });

  test('uses the provided parent-revision', async () => {
    await expect(createBuild(config, { parentRevision: 'abcdefg', skipDirtyCheck: true })).resolves.toMatchObject({
      meta: { parentRevision: 'abcdefg' },
    });
  });

  test('allows overriding the git branch name check', async () => {
    isDirtySpy.mockReturnValue(Promise.resolve(true));

    await expect(createBuild(config, { branch: 'burritos', skipDirtyCheck: true })).resolves.toMatchObject({
      meta: expect.objectContaining({ branch: 'burritos' }),
    });
    expect(getBranchSpy).not.toHaveBeenCalled();
  });

  test('allows skipping the git worktree check', async () => {
    jest.spyOn(Git, 'isDirty').mockReturnValue(Promise.resolve(true));

    await expect(createBuild(config, { skipDirtyCheck: true })).resolves.toEqual(expect.any(Object));
  });

  test('throws if the working tree is dirty', async () => {
    jest.spyOn(Git, 'isDirty').mockReturnValue(Promise.resolve(true));
    await expect(createBuild(config, { skipDirtyCheck: false })).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Current work tree is dirty. Please commit all changes before proceeding"`
    );
  });

  test('returns a JSON representation of a build', async () => {
    getBranchSpy.mockReturnValue(Promise.resolve('tacobranch'));

    await expect(createBuild(config, { skipDirtyCheck: true })).resolves.toMatchObject({
      meta: {
        branch: 'tacobranch',
        parentRevision: '1234567',
        revision: 'abcdefg',
        timestamp: 1234567890,
        author: 'Jimmy',
        subject: 'tacos',
      },
      artifacts: [
        {
          hash: '764196c430cf8a94c698b74b6dfdad71',
          name: '../../fakedist/main.1234567.js',
          sizes: {
            brotli: 49,
            gzip: 74,
            stat: 65,
          },
        },
        {
          hash: '415dec15fc798bb79f499aeff00258fb',
          name: '../../fakedist/test-folder/test-no-extension',
          sizes: {
            brotli: 49,
            gzip: 54,
            stat: 34,
          },
        },
        {
          hash: '0b3bb1892728da2a8a5af73335a51f35',
          name: '../../fakedist/vendor.js',
          sizes: {
            brotli: 49,
            gzip: 83,
            stat: 83,
          },
        },
      ],
    });
  });

  test('returns a revision and parentRevision url if buildUrlFormat is provided', async () => {
    getBranchSpy.mockReturnValue(Promise.resolve('tacobranch'));

    await expect(createBuild(configWithFormatUrl, { skipDirtyCheck: true })).resolves.toMatchObject({
      meta: {
        revision: { url: 'https://github.com/paularmstrong/build-tracker/commit/abcdefg', value: 'abcdefg' },
        parentRevision: { url: 'https://github.com/paularmstrong/build-tracker/commit/1234567', value: '1234567' },
      },
    });
  });

  test('can include extra meta', async () => {
    await expect(
      createBuild(config, {
        meta: { foo: 'bar', baz: { url: 'https://buildtracker.dev', value: 'baz' } },
        skipDirtyCheck: true,
      })
    ).resolves.toMatchObject({
      meta: { revision: 'abcdefg', foo: 'bar', baz: { url: 'https://buildtracker.dev', value: 'baz' } },
    });
  });
});
