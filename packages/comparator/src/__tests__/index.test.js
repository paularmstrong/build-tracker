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
  test('returns an array of BuildDeltas', () => {
    const build1 = {
      meta: { foo: 'yes' },
      artifacts: {
        tacos: { hash: 'abc', size: 123, gzipSize: 45 },
        churros: { hash: 'abc', size: 456, gzipSize: 90 }
      }
    };

    const build2 = {
      meta: { foo: 'yes' },
      artifacts: {
        tacos: { hash: 'abc', size: 123, gzipSize: 45 },
        burritos: { hash: 'def', size: 469, gzipSize: 93 }
      }
    };

    const build3 = {
      meta: { foo: 'yes' },
      artifacts: {
        tacos: { hash: 'abc', size: 123, gzipSize: 45 },
        burritos: { hash: 'ghi', size: 345, gzipSize: 85 }
      }
    };

    expect(Comparator.getBuildDeltas(build1, build2, build3)).toMatchSnapshot();
  });
});
