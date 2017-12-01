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
          if ('sizePercent' in cell && 'size' in cell) {
            return cell.size > 3;
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
          if ('sizePercent' in cell && 'size' in cell) {
            return cell.size > 3;
          }
          return false;
        });
      };
      expect(comparator.getCsv({ rowFilter })).toMatchSnapshot();
    });
  });
});
