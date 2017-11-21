import BuildComparator, * as Comparator from '../';

const build1 = {
  meta: { revision: '1234567' },
  artifacts: {
    churros: { hash: 'abc', size: 456, gzipSize: 90 },
    tacos: { hash: 'abc', size: 123, gzipSize: 45 }
  }
};

const build2 = {
  meta: { revision: '8901234' },
  artifacts: {
    burritos: { hash: 'def', size: 469, gzipSize: 93 },
    tacos: { hash: 'abc', size: 123, gzipSize: 45 }
  }
};

const build3 = {
  meta: { revision: '5678901' },
  artifacts: {
    burritos: { hash: 'ghi', size: 345, gzipSize: 85 },
    tacos: { hash: 'abc', size: 123, gzipSize: 45 }
  }
};

// describe('getAllArtifactNames', () => {
//   test('returns an array of artifact names from builds', () => {
//     expect(Comparator.getAllArtifactNames([{ artifacts: { foo: {}, bar: {} } }])).toEqual(['foo', 'bar']);
//   });

//   test('returns only unique artifact names', () => {
//     expect(
//       Comparator.getAllArtifactNames([
//         { artifacts: { foo: {}, bar: {} } },
//         { artifacts: { baz: {}, bar: {} } },
//         { artifacts: { foo: {}, bop: {} } }
//       ])
//     ).toEqual(['foo', 'bar', 'baz', 'bop']);
//   });
// });

// describe('getBuildDeltas', () => {
//   test('returns an array of BuildDeltas', () => {
//     expect(Comparator.getBuildDeltas([build1, build2, build3])).toMatchSnapshot();
//   });
// });

// describe('getBuildComparisonMatrix', () => {
//   test('gets a matrix', () => {
//     expect(Comparator.getBuildComparisonMatrix([build1, build2, build3])).toMatchSnapshot();
//   });
// });

describe('BuildComparator', () => {
  describe('artifactNames', () => {
    test('includes all artifact names', () => {
      const comparator = new BuildComparator([build1, build2]);
      expect(comparator.artifactNames).toEqual(expect.arrayContaining(['burritos', 'churros', 'tacos']));
    });
  });

  describe('buildDeltas', () => {
    test('returns an array of deltas', () => {
      const comparator = new BuildComparator([build1, build2]);
      expect(comparator.buildDeltas).toMatchSnapshot();
    });
  });

  describe('matrix', () => {
    test('includes a header', () => {
      const comparator = new BuildComparator([build1, build2]);
      expect(comparator.matrix[0]).toEqual(comparator.matrixHeader);
      expect(comparator.matrix[0]).toMatchSnapshot();
    });

    test('includes a total', () => {
      const comparator = new BuildComparator([build1, build2]);
      expect(comparator.matrix[1]).toEqual(comparator.matrixTotal);
      expect(comparator.matrix[1]).toMatchSnapshot();
    });

    test('includes a body of all artifacts', () => {
      const comparator = new BuildComparator([build1, build2]);
      const matrix = comparator.matrix;
      expect(matrix.slice(2)).toEqual(comparator.matrixBody);
      expect(matrix.slice(2)).toMatchSnapshot();
    });
  });
});
