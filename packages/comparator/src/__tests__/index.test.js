import BuildComparator from '../';

const build1 = {
  meta: { revision: '1234567' },
  artifacts: {
    churros: { hash: 'abc', stat: 456, gzip: 90 },
    tacos: { hash: 'abc', stat: 123, gzip: 45 }
  }
};

const build2 = {
  meta: { revision: '8901234' },
  artifacts: {
    burritos: { hash: 'def', stat: 469, gzip: 93 },
    tacos: { hash: 'abc', stat: 123, gzip: 45 }
  }
};

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

    test('are cached across gets', () => {
      const comparator = new BuildComparator([build1, build2]);
      expect(comparator.buildDeltas).toBe(comparator.buildDeltas);
    });
  });

  describe('matrix', () => {
    test('includes a header', () => {
      const comparator = new BuildComparator([build1, build2]);
      expect(comparator.matrix.header).toEqual(comparator.matrixHeader);
      expect(comparator.matrix.header).toMatchSnapshot();
    });

    test('includes a total', () => {
      const comparator = new BuildComparator([build1, build2]);
      expect(comparator.matrix.total).toEqual(comparator.matrixTotal);
      expect(comparator.matrix.total).toMatchSnapshot();
    });

    test('includes a body of all artifacts', () => {
      const comparator = new BuildComparator([build1, build2]);
      expect(comparator.matrix.body).toEqual(comparator.matrixBody);
      expect(comparator.matrix.body).toMatchSnapshot();
    });
  });

  describe('getAscii', () => {
    test('gets an ASCII table', () => {
      const comparator = new BuildComparator([build1, build2]);
      expect(comparator.getAscii()).toMatchSnapshot();
    });

    test('can filter rows', () => {
      const comparator = new BuildComparator([build1, build2]);
      const rowFilter = row => {
        return row.some(cell => {
          if ('statPercent' in cell && 'stat' in cell) {
            return cell.stat > 3;
          }
          return false;
        });
      };
      expect(comparator.getAscii({ rowFilter })).toMatchSnapshot();
    });
  });

  describe('getCsv', () => {
    test('gets a CSV formatted table', () => {
      const comparator = new BuildComparator([build1, build2]);
      expect(comparator.getCsv()).toMatchSnapshot();
    });

    test('can filter rows', () => {
      const comparator = new BuildComparator([build1, build2]);
      const rowFilter = row => {
        return row.some(cell => {
          if ('statPercent' in cell && 'stat' in cell) {
            return cell.stat > 3;
          }
          return false;
        });
      };
      expect(comparator.getCsv({ rowFilter })).toMatchSnapshot();
    });
  });
});
