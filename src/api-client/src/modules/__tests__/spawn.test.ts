/**
 * Copyright (c) 2019 Paul Armstrong
 */
import childProcess from 'child_process';
import mockSpawn from 'mock-spawn';
import spawn from '../spawn';

describe('spawn', () => {
  let mspawn;
  beforeEach(() => {
    mspawn = mockSpawn();
    jest.spyOn(childProcess, 'spawn').mockImplementation(mspawn);
  });

  describe('rejects', () => {
    test('on process error', () => {
      const tacoError = new Error('tacos');
      mspawn.sequence.add(function(cb) {
        this.emit('error', tacoError);
        cb(1);
      });
      return spawn('foo').catch(err => {
        expect(err.code).toBe(1);
        expect(err.errors.spawn).toBe(tacoError);
      });
    });

    test('on stdout err', () => {
      mspawn.sequence.add(function(cb) {
        this.stdout.emit('error', 'tacos');
        cb(2);
      });
      return spawn('foo').catch(err => {
        expect(err.code).toBe(2);
        expect(err.errors.stdout).toBe('tacos');
      });
    });

    test('on stderr err', () => {
      mspawn.sequence.add(function(cb) {
        this.stderr.emit('error', 'nachos');
        cb(3);
      });
      return spawn('foo').catch(err => {
        expect(err.code).toBe(3);
        expect(err.errors.stderr).toBe('nachos');
      });
    });

    test('with the stderr output', () => {
      mspawn.sequence.add(function(cb) {
        this.stderr.write('bur');
        this.stderr.write('ritos');
        cb(3);
      });
      return spawn('foo').catch(err => {
        expect(err.code).toBe(3);
        expect(err.stderr.toString()).toBe('burritos');
      });
    });
  });

  describe('resolves', () => {
    test('with the stdout', () => {
      mspawn.sequence.add(function(cb) {
        this.stdout.write('bur');
        this.stdout.write('ritos');
        cb(0);
      });
      return spawn('foo').then(res => {
        expect(res.toString()).toBe('burritos');
      });
    });
  });
});
