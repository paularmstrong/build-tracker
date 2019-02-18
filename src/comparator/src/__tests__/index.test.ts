import BuildComparator from '..';
import Build from '@build-tracker/build';
import BuildDelta from '../BuildDelta';

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
      const [, build1Total, build2Total, deltaTotal] = comparator.matrixTotal;
      expect(build1Total).toMatchObject(expect.objectContaining({ sizes: { gzip: 45, stat: 123 } }));
      expect(build2Total).toMatchObject(expect.objectContaining({ sizes: { gzip: 43, stat: 123 } }));
      expect(deltaTotal).toMatchObject(
        expect.objectContaining({ sizes: { gzip: -2, gzipPercent: -0.044444444444444446, stat: 0, statPercent: 0 } })
      );
    });

    test('filters artifacts from artifactNames', () => {
      expect(comparator.artifactNames).toEqual(['tacos']);
    });

    test('filters artifacts from the matrixBody', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.matrixBody).toHaveLength(1);
      expect(comparator.matrixBody[0][0]).toMatchObject({ text: 'tacos' });
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

    test('is an array of arrays of deltas', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.buildDeltas).toHaveLength(2);
      expect(comparator.buildDeltas[0]).toHaveLength(0);
      expect(comparator.buildDeltas[1]).toHaveLength(1);
      expect(comparator.buildDeltas[1][0]).toBeInstanceOf(BuildDelta);
    });
  });

  describe('getSum', () => {
    test('gets a row of sums', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      const [, build1Sum, build2Sum, deltaSum] = comparator.getSum(['churros', 'tacos']);
      expect(build1Sum).toMatchObject(expect.objectContaining({ sizes: { gzip: 135, stat: 579 } }));
      expect(build2Sum).toMatchObject(expect.objectContaining({ sizes: { gzip: 43, stat: 123 } }));
      expect(deltaSum).toMatchObject(
        expect.objectContaining({ sizes: { gzip: -2, gzipPercent: -0.044444444444444446, stat: 0, statPercent: 0 } })
      );
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
      const [, sum] = comparator.getSum(['i18n/en']);
      expect(sum).toMatchObject(expect.objectContaining({ sizes: { gzip: 90, stat: 456 } }));
    });
  });

  describe('toJSON', () => {
    test('includes the header', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toJSON().header).toEqual(comparator.matrixHeader);
    });

    test('includes the total', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toJSON().total).toEqual(comparator.matrixTotal);
    });

    test('includes the body', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toJSON().body).toEqual(comparator.matrixBody);
    });
  });

  describe('toMarkdown', () => {
    test('gets a markdown-formatted table', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toMarkdown()).toEqual(
        `
|          | 1234567 | 8901234 |            Δ1 |
| :------- | ------: | ------: | ------------: |
| burritos |       0 |      93 |   93 (100.0%) |
| churros  |      90 |       0 | -90 (-100.0%) |
| tacos    |      45 |      43 |    -2 (-4.4%) |`
          .replace(/^\n/, '')
          .replace(/\n$/, '')
      );
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
      expect(comparator.toMarkdown({ rowFilter })).toEqual(
        `
|          | 1234567 | 8901234 |            Δ1 |
| :------- | ------: | ------: | ------------: |
| burritos |       0 |      93 |   93 (100.0%) |
| churros  |      90 |       0 | -90 (-100.0%) |
`
          .replace(/^\n/, '')
          .replace(/\n$/, '')
      );
    });

    test('does not include filtered artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.toMarkdown()).toEqual(
        `
|       | 1234567 | 8901234 |         Δ1 |
| :---- | ------: | ------: | ---------: |
| tacos |      45 |      43 | -2 (-4.4%) |`
          .replace(/^\n/, '')
          .replace(/\n$/, '')
      );
    });
  });

  describe('toCsv', () => {
    test('gets a CSV formatted table', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toCsv()).toEqual(
        ',1234567,8901234,Δ1\r\nburritos,0,93,93 (100.0%)\r\nchurros,90,0,-90 (-100.0%)\r\ntacos,45,43,-2 (-4.4%)'
      );
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
      expect(comparator.toCsv({ rowFilter })).toEqual(
        ',1234567,8901234,Δ1\r\nburritos,0,93,93 (100.0%)\r\nchurros,90,0,-90 (-100.0%)'
      );
    });

    test('does not include filtered artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.toCsv()).toEqual(',1234567,8901234,Δ1\r\ntacos,45,43,-2 (-4.4%)');
    });
  });
});
