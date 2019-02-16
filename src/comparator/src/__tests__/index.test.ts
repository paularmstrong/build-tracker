import BuildComparator from '..';
import Build from '@build-tracker/build';

const build1 = new Build({ revision: '1234567', timestamp: 1234567 }, [
  { name: 'churros', hash: 'abc', sizes: { stat: 456, gzip: 90 } },
  { name: 'tacos', hash: 'abc', sizes: { stat: 123, gzip: 45 } }
]);

const build2 = new Build({ revision: '8901234', timestamp: 8901234 }, [
  { name: 'burritos', hash: 'def', sizes: { stat: 469, gzip: 93 } },
  { name: 'tacos', hash: 'abc', sizes: { stat: 123, gzip: 43 } }
]);

const artifactFilters = [/burritos/, /churros/];

describe('BuildComparator', () => {
  describe('artifactFilters', () => {
    const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });

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
    test('are cached across gets', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.buildDeltas).toBe(comparator.buildDeltas);
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
      // @ts-ignore
      expect(comparator.matrix.body[0][0].text).toEqual('tacos');
    });
  });

  describe('getSum', () => {
    test('gets a row of sums', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      const sum = comparator.getSum(['churros', 'tacos']);
      expect(sum).toMatchSnapshot();
    });

    test('filters on exact names', () => {
      const comparator = new BuildComparator({
        builds: [
          new Build({ revision: '1234567', timestamp: 1234567 }, [
            { name: 'i18n/en', hash: 'abc', sizes: { stat: 456, gzip: 90 } },
            { name: 'i18n/en-GB', hash: 'abc', sizes: { stat: 123, gzip: 45 } }
          ])
        ]
      });
      const sum = comparator.getSum(['i18n/en']);
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
      const rowFilter = (row): boolean => {
        return row.some(cell => {
          if (cell.sizes && 'gzip' in cell.sizes) {
            return cell.sizes.gzip > 50;
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
      const rowFilter = (row): boolean => {
        return row.some(cell => {
          if (cell.sizes && 'gzip' in cell.sizes) {
            return cell.sizes.gzip > 50;
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
