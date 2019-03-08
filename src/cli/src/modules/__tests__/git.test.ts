/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Git from '../git';
import * as Spawn from '../spawn';

describe('git', () => {
  describe('isDirty', () => {
    test('returns true of the repo has un-committed changes', () => {
      jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from(' M src/cli/package.json')));

      return Git.isDirty().then(dirty => {
        expect(dirty).toBe(true);
      });
    });

    test('returns false if the status is clean', () => {
      jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.isDirty().then(dirty => {
        expect(dirty).toBe(false);
      });
    });

    test('uses the process cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.isDirty().then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: process.env.cwd });
      });
    });

    test('uses given cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.isDirty('tacos').then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: 'tacos' });
      });
    });
  });

  describe('getDefaultBranch', () => {
    test('returns the default branch of the repo', () => {
      jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('chili')));

      return Git.getDefaultBranch().then(branch => {
        expect(branch).toBe('chili');
      });
    });

    test('uses the process cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.getDefaultBranch().then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: process.env.cwd });
      });
    });

    test('uses given cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.getDefaultBranch('tacos').then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: 'tacos' });
      });
    });
  });

  describe('getParentRevision', () => {
    test('returns the merge base for the current revision', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('123556')));

      return Git.getParentRevision('tacos').then(branch => {
        expect(spawn).toHaveBeenCalledWith(
          expect.any(String),
          ['merge-base', 'HEAD', 'origin/tacos'],
          expect.any(Object)
        );
        expect(branch).toBe('123556');
      });
    });

    test('uses the process cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.getParentRevision('master').then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: process.env.cwd });
      });
    });

    test('uses given cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.getParentRevision('master', 'tacos').then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: 'tacos' });
      });
    });
  });
});
