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
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: process.cwd() });
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
      jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('asdf\nHEAD branch: chili\n')));

      return Git.getDefaultBranch().then(branch => {
        expect(branch).toBe('chili');
      });
    });

    test('uses the process cwd', () => {
      const spawn = jest
        .spyOn(Spawn, 'default')
        .mockImplementation(() => Promise.resolve(Buffer.from('asdf\nHEAD branch: chili\n')));

      return Git.getDefaultBranch().then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: process.cwd() });
      });
    });

    test('uses given cwd', () => {
      const spawn = jest
        .spyOn(Spawn, 'default')
        .mockImplementation(() => Promise.resolve(Buffer.from('asdf\nHEAD branch: chili\n')));

      return Git.getDefaultBranch('tacos').then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: 'tacos' });
      });
    });
  });

  describe('getBranch', () => {
    test('gets the branch name', () => {
      jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from(' \n\ttacosaregreat\n')));
      return Git.getBranch().then(branch => {
        expect(branch).toBe('tacosaregreat');
      });
    });

    test('uses the process cwd', () => {
      const spawn = jest
        .spyOn(Spawn, 'default')
        .mockImplementation(() => Promise.resolve(Buffer.from(' \n\ttacosaregreat\n')));

      return Git.getBranch().then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: process.cwd() });
      });
    });

    test('uses given cwd', () => {
      const spawn = jest
        .spyOn(Spawn, 'default')
        .mockImplementation(() => Promise.resolve(Buffer.from(' \n\ttacosaregreat\n')));

      return Git.getBranch('tacos').then(() => {
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
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: process.cwd() });
      });
    });

    test('uses given cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.getParentRevision('master', 'tacos').then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: 'tacos' });
      });
    });
  });

  describe('getCurrentRevision', () => {
    test('uses the process cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.getCurrentRevision().then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: process.cwd() });
      });
    });

    test('uses given cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.getCurrentRevision('tacos').then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: 'tacos' });
      });
    });
  });

  describe('getRevisionDetails', () => {
    test('returns an object of details', () => {
      const del = `${0x1f};${0x1f}`;
      jest
        .spyOn(Spawn, 'default')
        .mockImplementation(() => Promise.resolve(Buffer.from(`1551808003${del}jimmy${del}tacos, tacos, tacos`)));

      return Git.getRevisionDetails('12345').then(res => {
        expect(res).toEqual({
          timestamp: 1551808003,
          name: 'jimmy',
          subject: 'tacos, tacos, tacos'
        });
      });
    });

    test('uses the process cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.getRevisionDetails('12345').then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: process.cwd() });
      });
    });

    test('uses given cwd', () => {
      const spawn = jest.spyOn(Spawn, 'default').mockImplementation(() => Promise.resolve(Buffer.from('\n')));

      return Git.getRevisionDetails('12345', 'tacos').then(() => {
        expect(spawn).toHaveBeenCalledWith(expect.any(String), expect.any(Array), { cwd: 'tacos' });
      });
    });
  });
});
