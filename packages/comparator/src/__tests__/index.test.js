// @flow
import BuildComparator from '../';

const build1 = {
  meta: { revision: '1234567', timestamp: 1234567 },
  artifacts: {
    churros: { name: 'churros', hash: 'abc', stat: 456, gzip: 90 },
    tacos: { name: 'tacos', hash: 'abc', stat: 123, gzip: 45 }
  }
};

const build2 = {
  meta: { revision: '8901234', timestamp: 8901234 },
  artifacts: {
    burritos: { name: 'burritos', hash: 'def', stat: 469, gzip: 93 },
    tacos: { name: 'tacos', hash: 'abc', stat: 123, gzip: 43 }
  }
};

const artifactFilters = [/burritos/, /churros/];

describe('BuildComparator', () => {
  describe('artifactFilters', () => {
    const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters: [/burritos/, /churros/] });
    test('filters artifact sizes from the totals', () => {
      expect(comparator.matrixTotal).toMatchSnapshot();
    });

    test('filters artifacts from artifactNames', () => {
      expect(comparator.artifactNames).toEqual(['tacos']);
    });
  });

  describe('artifactNames', () => {
    test('includes all artifact names', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.artifactNames).toEqual(expect.arrayContaining(['burritos', 'churros', 'tacos']));
    });
  });

  describe('buildDeltas', () => {
    test('returns an array of deltas', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.buildDeltas).toMatchSnapshot();
    });

    test('are cached across gets', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.buildDeltas).toBe(comparator.buildDeltas);
    });

    test('does not include filtered artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.buildDeltas[0].artifactDeltas).toHaveLength(0);
      expect(comparator.buildDeltas[1].artifactDeltas).toHaveLength(1);
    });
  });

  describe('matrix', () => {
    test('includes a header', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrix.header).toEqual(comparator.matrixHeader);
      expect(comparator.matrix.header).toMatchSnapshot();
    });

    test('includes a total', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrix.total).toEqual(comparator.matrixTotal);
      expect(comparator.matrix.total).toMatchSnapshot();
    });

    test('includes a body of all artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrix.body).toEqual(comparator.matrixBody);
      expect(comparator.matrix.body).toMatchSnapshot();
    });

    test('does not include filtered artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.matrix.body).toHaveLength(1);
      // $FlowFixMe
      expect(comparator.matrix.body[0][0].text).toEqual('tacos');
    });
  });

  describe('getSum', () => {
    test('gets a row of sums', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      const sum = comparator.getSum(['churros', 'tacos']);
      expect(sum).toMatchSnapshot();
    });
  });

  describe('getAscii', () => {
    test('gets an ASCII table', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.getAscii()).toMatchSnapshot();
    });

    test('can filter rows', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      const rowFilter = row => {
        return row.some(cell => {
          if ('statPercent' in cell && 'stat' in cell) {
            // $FlowFixMe
            return cell.stat > 3;
          }
          return false;
        });
      };
      expect(comparator.getAscii({ rowFilter })).toMatchSnapshot();
    });

    test('does not include filtered artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.getAscii()).toMatchSnapshot();
    });
  });

  describe('getCsv', () => {
    test('gets a CSV formatted table', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.getCsv()).toMatchSnapshot();
    });

    test('can filter rows', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      const rowFilter = row => {
        return row.some(cell => {
          if ('statPercent' in cell && 'stat' in cell) {
            // $FlowFixMe
            return cell.stat > 3;
          }
          return false;
        });
      };
      expect(comparator.getCsv({ rowFilter })).toMatchSnapshot();
    });

    test('does not include filtered artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.getCsv()).toMatchSnapshot();
    });
  });
});
