import * as Comparator from '../';

describe('getAllArtifactNames', () => {
  test('returns an array of artifact names from builds', () => {
    expect(Comparator.getAllArtifactNames({ artifacts: { foo: {}, bar: {} } })).toEqual(['foo', 'bar']);
  });

  test('returns only unique artifact names', () => {
    expect(
      Comparator.getAllArtifactNames(
        { artifacts: { foo: {}, bar: {} } },
        { artifacts: { baz: {}, bar: {} } },
        { artifacts: { foo: {}, bop: {} } }
      )
    ).toEqual(['foo', 'bar', 'baz', 'bop']);
  });
});

describe('getBuildDeltas', () => {
  test('returns deltas', () => {
    const build1 = {
      meta: { foo: 'yes' },
      artifacts: {
        tacos: { size: 123, gzipSize: 45 },
        churros: { size: 456, gzipSize: 90 }
      }
    };

    const build2 = {
      meta: { foo: 'yes' },
      artifacts: {
        tacos: { size: 123, gzipSize: 45 },
        burritos: { size: 469, gzipSize: 93 }
      }
    };

    const build3 = {
      meta: { foo: 'yes' },
      artifacts: {
        tacos: { size: 123, gzipSize: 45 },
        burritos: { size: 345, gzipSize: 85 }
      }
    };

    expect(Comparator.getBuildDeltas(build1, build2, build3)).toEqual([
      { ...build1, artifactDeltas: [], deltas: [] },
      {
        ...build2,
        artifactDeltas: [
          expect.objectContaining({
            tacos: { size: 0, gzipSize: 0 },
            burritos: { size: 469, gzipSize: 93 },
            churros: { size: -456, gzipSize: -90 }
          })
        ],
        deltas: []
      },
      {
        ...build3,
        artifactDeltas: [
          expect.objectContaining({
            tacos: { size: 0, gzipSize: 0 },
            burritos: { size: 345, gzipSize: 85 },
            churros: { size: -456, gzipSize: -90 }
          }),
          expect.objectContaining({
            tacos: { size: 0, gzipSize: 0 },
            burritos: { size: -124, gzipSize: -8 },
            churros: { size: 0, gzipSize: 0 }
          })
        ],
        deltas: []
      }
    ]);
  });
});
