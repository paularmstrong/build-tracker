/**
 * Copyright (c) 2019 Paul Armstrong
 */
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

  describe('baseBuild', () => {
    test('gets the base build', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.baseBuild).toBe(buildA);
    });
  });

  describe('prevBuild', () => {
    test('gets the prev build', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.prevBuild).toBe(buildB);
    });
  });

  describe('artifactSizes', () => {
    test('gets a list of size keys available', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.artifactSizes).toEqual(['stat', 'gzip']);
    });

    test('throws an error if builds do not have same artifact size keys', () => {
      const bd = new BuildDelta(
        buildA,
        new Build(
          {
            revision: { value: '123', url: 'https://build-tracker.local' },
            parentRevision: 'abc',
            timestamp: Date.now()
          },
          [{ name: 'tacos', hash: 'abc', sizes: {} }]
        )
      );
      expect(() => bd.artifactSizes).toThrow();
    });
  });

  describe('artifactNames', () => {
    test('gets a set of artifact names', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(Array.from(bd.artifactNames)).toEqual(['tacos', 'burritos', 'churros']);
    });

    test('filters out filtered artifact names', () => {
      const bd = new BuildDelta(buildA, buildB, { artifactFilters: [/churros/] });
      expect(Array.from(bd.artifactNames)).toEqual(['tacos', 'burritos']);
    });
  });

  describe('artifactDeltas', () => {
    test('gets an array of deltas for all artifacts', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.artifactDeltas).toEqual([
        {
          budgets: [],
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
          budgets: [],
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
          budgets: [],
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

    test('artifact deltas when adding artifacts', () => {
      const bd = new BuildDelta(buildB, buildA);
      expect(bd.artifactDeltas).toEqual([
        {
          budgets: [],
          hashChanged: false,
          name: 'tacos',
          sizes: {
            gzip: 0,
            stat: -1
          },
          percents: {
            gzip: 0,
            stat: -0.5
          }
        },
        {
          budgets: [],
          hashChanged: false,
          name: 'burritos',
          sizes: {
            gzip: 2,
            stat: 3
          },
          percents: {
            gzip: 1,
            stat: 1
          }
        },
        {
          budgets: [],
          hashChanged: true,
          name: 'churros',
          sizes: {
            gzip: 4,
            stat: 6
          },
          percents: {
            gzip: 1,
            stat: 1
          }
        }
      ]);
    });

    test('respects artifact filters', () => {
      const bd = new BuildDelta(buildA, buildB, { artifactFilters: [/churros/, /burritos/] });
      expect(bd.artifactDeltas).toEqual([
        {
          budgets: [],
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
        budgets: [],
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

    test('includes passing budgets', () => {
      const bd = new BuildDelta(buildA, buildB, {
        artifactBudgets: {
          burritos: [{ level: 'error', sizeKey: 'gzip', type: 'size', maximum: 5 }]
        }
      });
      expect(bd.getArtifactDelta('burritos')).toMatchObject({
        budgets: [
          {
            passing: true,
            expected: 5,
            actual: 2,
            type: 'size',
            level: 'error'
          }
        ]
      });
    });

    test('includes failing budgets for size', () => {
      const bd = new BuildDelta(buildB, buildA, {
        artifactBudgets: {
          burritos: [{ level: 'error', sizeKey: 'stat', type: 'size', maximum: 5 }]
        }
      });
      expect(bd.getArtifactDelta('burritos')).toMatchObject({
        budgets: [
          {
            passing: false,
            expected: 5,
            actual: 6,
            type: 'size',
            level: 'error'
          }
        ]
      });
    });

    test('includes failing budgets for delta', () => {
      const bd = new BuildDelta(buildB, buildA, {
        artifactBudgets: {
          burritos: [{ level: 'error', sizeKey: 'gzip', type: 'delta', maximum: 2 }]
        }
      });
      expect(bd.getArtifactDelta('burritos')).toMatchObject({
        budgets: [
          {
            passing: false,
            expected: 2,
            actual: 2,
            type: 'delta',
            level: 'error'
          }
        ]
      });
    });

    test('includes failing budgets for percentDelta', () => {
      const bd = new BuildDelta(buildB, buildA, {
        artifactBudgets: {
          burritos: [{ level: 'error', sizeKey: 'stat', type: 'percentDelta', maximum: 0.5 }]
        }
      });
      expect(bd.getArtifactDelta('burritos')).toMatchObject({
        budgets: [
          {
            passing: false,
            expected: 0.5,
            actual: 1,
            type: 'percentDelta',
            level: 'error'
          }
        ]
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
      const bd = new BuildDelta(buildA, buildB, { artifactFilters: [/burritos/] });
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
