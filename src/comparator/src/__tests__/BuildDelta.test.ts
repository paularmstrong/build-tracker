import Build from '@build-tracker/build';
import BuildDelta from '../BuildDelta';

describe('BuildDelta', () => {
  let buildA, buildB;
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1550528708828);

    buildA = new Build(
      { revision: { value: '123', url: 'https://build-tracker.local' }, parentRevision: 'abc', timestamp: Date.now() },
      [
        { name: 'tacos', hash: '123', sizes: { stat: 2, gzip: 1 } },
        { name: 'burritos', hash: '123', sizes: { stat: 3, gzip: 2 } }
      ]
    );
    buildB = new Build(
      { revision: { value: '456', url: 'https://build-tracker.local' }, parentRevision: 'abc', timestamp: Date.now() },
      [
        { name: 'tacos', hash: '123', sizes: { stat: 1, gzip: 1 } },
        { name: 'burritos', hash: '123', sizes: { stat: 6, gzip: 4 } },
        { name: 'churros', hash: '123', sizes: { stat: 6, gzip: 4 } }
      ]
    );
  });

  describe('meta', () => {
    test('gets the full meta object', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.meta).toEqual({
        revision: { value: '123', url: 'https://build-tracker.local' },
        parentRevision: 'abc',
        timestamp: Date.now()
      });
    });
  });

  describe('timestamp', () => {
    test('gets the timestamp as a Date', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.timestamp).toBeInstanceOf(Date);
      expect(bd.timestamp).toEqual(new Date(Date.now()));
    });
  });

  describe('getMetaValue', () => {
    test('gets the value as a string, from a string', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.getMetaValue('revision')).toBe('123');
      expect(bd.getMetaValue('parentRevision')).toBe('abc');
    });
  });

  describe('getMetaUrl', () => {
    test("when available, gets the meta key's URL", () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.getMetaUrl('revision')).toBe('https://build-tracker.local');
    });

    test('when unavailable, returns undefined', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.getMetaUrl('parentRevision')).toBeUndefined();
    });
  });

  describe('artifactNames', () => {
    test('gets a set of artifact names', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(Array.from(bd.artifactNames)).toEqual(['tacos', 'burritos', 'churros']);
    });

    test('filters out filtered artifact names', () => {
      const bd = new BuildDelta(buildA, buildB, [/churros/]);
      expect(Array.from(bd.artifactNames)).toEqual(['tacos', 'burritos']);
    });
  });

  describe('artifactDeltas', () => {
    test('gets an array of deltas for all artifacts', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.artifactDeltas).toEqual([
        {
          hashChanged: false,
          name: 'tacos',
          sizes: {
            gzip: 0,
            stat: 1
          },
          percents: {
            gzip: 0,
            stat: 1
          }
        },
        {
          hashChanged: false,
          name: 'burritos',
          sizes: {
            gzip: -2,
            stat: -3
          },
          percents: {
            gzip: -0.5,
            stat: -0.5
          }
        },
        {
          hashChanged: true,
          name: 'churros',
          sizes: {
            gzip: -4,
            stat: -6
          },
          percents: {
            gzip: -1,
            stat: -1
          }
        }
      ]);
    });

    test('respects artifact filters', () => {
      const bd = new BuildDelta(buildA, buildB, [/churros/, /burritos/]);
      expect(bd.artifactDeltas).toEqual([
        {
          hashChanged: false,
          name: 'tacos',
          sizes: {
            gzip: 0,
            stat: 1
          },
          percents: {
            gzip: 0,
            stat: 1
          }
        }
      ]);
    });
  });

  describe('getArtifactDelta', () => {
    test('gets the delta for a single artifact', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.getArtifactDelta('tacos')).toEqual({
        hashChanged: false,
        name: 'tacos',
        sizes: {
          gzip: 0,
          stat: 1
        },
        percents: {
          gzip: 0,
          stat: 1
        }
      });
    });
  });

  describe('totalDelta', () => {
    test('gets the total delta of all assets added together', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.totalDelta).toEqual({
        againstRevision: '456',
        sizes: {
          gzip: -6,
          stat: -8
        },
        percents: {
          gzip: -(6 / 9),
          stat: -(8 / 13)
        }
      });
    });

    test('gets the total delta of all assets added together, without filtered artifacts', () => {
      const bd = new BuildDelta(buildA, buildB, [/burritos/]);
      expect(bd.totalDelta).toEqual({
        againstRevision: '456',
        sizes: {
          gzip: -4,
          stat: -5
        },
        percents: {
          gzip: -(4 / 5),
          stat: -(5 / 7)
        }
      });
    });
  });
});
