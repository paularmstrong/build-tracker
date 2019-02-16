import Build from '@build-tracker/build';
import BuildDelta from '../BuildDelta';

const buildA = new Build({ revision: '123', timestamp: Date.now() }, [
  { name: 'tacos', hash: '123', sizes: { stat: 2, gzip: 1 } },
  { name: 'burritos', hash: '123', sizes: { stat: 3, gzip: 2 } }
]);
const buildB = new Build({ revision: { value: '456', url: 'https://google.com' }, timestamp: Date.now() }, [
  { name: 'tacos', hash: '123', sizes: { stat: 1, gzip: 1 } },
  { name: 'burritos', hash: '123', sizes: { stat: 6, gzip: 4 } },
  { name: 'churros', hash: '123', sizes: { stat: 6, gzip: 4 } }
]);

describe('BuildDelta', () => {
  describe('getMetaValue', () => {
    test('gets the string value of a string meta from the base build', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.getMetaValue('revision')).toEqual('123');
    });

    test('gets the string value of an object meta from the base build', () => {
      const bd = new BuildDelta(buildB, buildA);
      expect(bd.getMetaValue('revision')).toEqual('456');
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
            gzipPercent: 0,
            stat: 1,
            statPercent: 1
          }
        },
        {
          hashChanged: false,
          name: 'burritos',
          sizes: {
            gzip: -2,
            gzipPercent: -0.5,
            stat: -3,
            statPercent: -0.5
          }
        },
        {
          hashChanged: true,
          name: 'churros',
          sizes: {
            gzip: -4,
            gzipPercent: -1,
            stat: -6,
            statPercent: -1
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
            gzipPercent: 0,
            stat: 1,
            statPercent: 1
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
          gzipPercent: 0,
          stat: 1,
          statPercent: 1
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
          gzipPercent: -(6 / 9),
          stat: -8,
          statPercent: -(8 / 13)
        }
      });
    });

    test('gets the total delta of all assets added together, without filtered artifacts', () => {
      const bd = new BuildDelta(buildA, buildB, [/burritos/]);
      expect(bd.totalDelta).toEqual({
        againstRevision: '456',
        sizes: {
          gzip: -4,
          gzipPercent: -(4 / 5),
          stat: -5,
          statPercent: -(5 / 7)
        }
      });
    });
  });
});
