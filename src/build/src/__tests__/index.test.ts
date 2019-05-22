/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '..';

const tacoArtifact = { name: 'tacos', hash: '123', sizes: { stat: 2, gzip: 1 } };
const burritoArtifact = { name: 'burritos', hash: '123', sizes: { stat: 3, gzip: 2 } };

describe('Build', () => {
  let baseMeta;
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1550528708000);
    baseMeta = {
      revision: '123',
      parentRevision: { value: 'abc', url: 'https://build-tracker.local' },
      timestamp: 1550528708
    };
  });

  describe('meta', () => {
    test('gets the full meta object', () => {
      const build = new Build(baseMeta, []);
      expect(build.meta).toEqual(baseMeta);
    });
  });

  describe('timestamp', () => {
    test('gets the timestamp as a Date', () => {
      const build = new Build(baseMeta, []);
      expect(build.timestamp).toBeInstanceOf(Date);
      expect(build.timestamp).toEqual(new Date(1550528708000));
    });
  });

  describe('getMetaValue', () => {
    test('gets the value as a string, from a string', () => {
      const build = new Build(baseMeta, []);
      expect(build.getMetaValue('revision')).toBe('123');
      expect(build.getMetaValue('parentRevision')).toBe('abc');
    });
  });

  describe('getMetaUrl', () => {
    test("when available, gets the meta key's URL", () => {
      const build = new Build(baseMeta, []);
      expect(build.getMetaUrl('parentRevision')).toBe('https://build-tracker.local');
    });

    test('when unavailable, returns undefined', () => {
      const build = new Build(baseMeta, []);
      expect(build.getMetaUrl('revision')).toBeUndefined();
    });
  });

  describe('artifacts', () => {
    test('gets all of the artifacts', () => {
      const build = new Build(baseMeta, [tacoArtifact, burritoArtifact]);
      expect(build.artifacts).toEqual([tacoArtifact, burritoArtifact]);
    });
  });

  describe('artifactSizes', () => {
    test('gets a lits of available size keys', () => {
      const build = new Build(baseMeta, [tacoArtifact]);
      expect(build.artifactSizes).toEqual(['stat', 'gzip']);
    });
  });

  describe('getArtfact', () => {
    test('can get by name', () => {
      const build = new Build(baseMeta, [tacoArtifact, burritoArtifact]);
      expect(build.getArtifact('tacos')).toBe(tacoArtifact);
      expect(build.getArtifact('burritos')).toBe(burritoArtifact);
    });
  });

  describe('artifactNames', () => {
    test('returns a list of all artifact names', () => {
      const build = new Build(baseMeta, [tacoArtifact, burritoArtifact]);
      expect(build.artifactNames).toEqual(['tacos', 'burritos']);
    });
  });

  describe('getSum', () => {
    test('gets a sum of the given artifact names', () => {
      const build = new Build(baseMeta, [
        tacoArtifact,
        burritoArtifact,
        { name: 'churros', hash: 'abc', sizes: { stat: 6, gzip: 4 } }
      ]);
      expect(build.getSum(['churros', 'burritos'])).toEqual({
        stat: 9,
        gzip: 6
      });
    });

    test('gets a sum even if an artifact does not exist', () => {
      const build = new Build(baseMeta, [
        tacoArtifact,
        burritoArtifact,
        { name: 'churros', hash: 'abc', sizes: { stat: 6, gzip: 4 } }
      ]);
      expect(build.getSum(['nachos', 'burritos'])).toEqual({
        stat: 3,
        gzip: 2
      });
    });
  });

  describe('getTotals', () => {
    test('gets the computed totals for all sizes', () => {
      const build = new Build(baseMeta, [tacoArtifact, burritoArtifact]);
      expect(build.getTotals()).toEqual({ stat: 5, gzip: 3 });
    });

    test('gets the computed totals without filtered artifacts', () => {
      const build = new Build(baseMeta, [tacoArtifact, burritoArtifact]);
      expect(build.getTotals([/tacos/])).toEqual({ stat: 3, gzip: 2 });
    });
  });

  describe('toJSON', () => {
    test('outputs a JSON friendly version of the meta and artifacts', () => {
      const build = new Build(baseMeta, [tacoArtifact, burritoArtifact]);
      expect(build.toJSON()).toEqual({
        meta: baseMeta,
        artifacts: expect.arrayContaining([burritoArtifact, tacoArtifact])
      });
    });
  });
});
