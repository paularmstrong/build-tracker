import Build from '..';

const tacoArtifact = { name: 'tacos', hash: '123', sizes: { stat: 2, gzip: 1 } };
const burritoArtifact = { name: 'burritos', hash: '123', sizes: { stat: 3, gzip: 2 } };

describe('Build', () => {
  describe('artifacts', () => {
    test('can get by name', () => {
      const build = new Build({ revision: '123', timestamp: Date.now() }, [tacoArtifact, burritoArtifact]);
      expect(build.getArtifact('tacos')).toBe(tacoArtifact);
      expect(build.getArtifact('burritos')).toBe(burritoArtifact);
    });
  });

  describe('getTotals', () => {
    test('gets the computed totals for all sizes', () => {
      const build = new Build({ revision: '123', timestamp: Date.now() }, [tacoArtifact, burritoArtifact]);
      expect(build.getTotals()).toEqual({ stat: 5, gzip: 3 });
    });

    test('gets the computed totals without filtered artifacts', () => {
      const build = new Build({ revision: '123', timestamp: Date.now() }, [tacoArtifact, burritoArtifact]);
      expect(build.getTotals([/tacos/])).toEqual({ stat: 3, gzip: 2 });
    });
  });
});
