import Build from '@build-tracker/build';
import BuildComparator from '..';
import BuildDelta from '../BuildDelta';

const build1 = new Build({ revision: '1234567abcdef', parentRevision: 'abcdef', timestamp: 1234567 }, [
  { name: 'burritos', hash: 'abc', sizes: { stat: 456, gzip: 90 } },
  { name: 'tacos', hash: 'abc', sizes: { stat: 123, gzip: 45 } }
]);

const build2 = new Build({ revision: '8901234abcdef', parentRevision: 'abcdef', timestamp: 8901234 }, [
  { name: 'tacos', hash: 'abc', sizes: { stat: 123, gzip: 43 } },
  { name: 'churros', hash: 'def', sizes: { stat: 469, gzip: 120 } }
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
        expect.objectContaining({
          sizes: { gzip: -2, stat: 0 },
          percents: {
            gzip: -0.044444444444444446,
            stat: 0
          }
        })
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

    test('sorts artifacts by average size', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.artifactNames).toEqual(['churros', 'burritos', 'tacos']);
    });
  });

  describe('sizeKeys', () => {
    test('gets a list of size keys available', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.sizeKeys).toEqual(['gzip', 'stat']);
    });

    test('throws an error if some builds have size keys that others do not', () => {
      const comparator = new BuildComparator({
        builds: [new Build(build1.meta, [{ name: 'tacos', hash: 'abc', sizes: { tacos: 123 } }]), build2]
      });
      expect(() => comparator.sizeKeys).toThrow();
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
      const [, build1Sum, build2Sum, deltaSum] = comparator.getSum(['burritos', 'tacos']);
      expect(build1Sum).toMatchObject(expect.objectContaining({ sizes: { gzip: 135, stat: 579 } }));
      expect(build2Sum).toMatchObject(expect.objectContaining({ sizes: { gzip: 43, stat: 123 } }));
      expect(deltaSum).toMatchObject(
        expect.objectContaining({
          sizes: { gzip: -2, stat: 0 },
          percents: {
            gzip: -0.044444444444444446,
            stat: 0
          }
        })
      );
    });

    test('filters on exact names', () => {
      const comparator = new BuildComparator({
        builds: [
          new Build({ revision: '1234567', parentRevision: 'abcdef', timestamp: 1234567 }, [
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
      expect(comparator.toJSON().header).toBe(comparator.matrixHeader);
    });

    test('includes the total', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toJSON().total).toBe(comparator.matrixTotal);
    });

    test('includes the body', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toJSON().body).toBe(comparator.matrixBody);
    });
  });

  describe('toMarkdown', () => {
    test('gets a markdown-formatted table', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toMarkdown()).toEqual(
        `
|          |  1234567 |  8901234 |                  Δ1 |
| :------- | -------: | -------: | ------------------: |
| All      | 0.13 KiB | 0.16 KiB |    0.03 KiB (20.7%) |
| churros  |    0 KiB | 0.12 KiB |   0.12 KiB (100.0%) |
| burritos | 0.09 KiB |    0 KiB | -0.09 KiB (-100.0%) |
| tacos    | 0.04 KiB | 0.04 KiB |       0 KiB (-4.4%) |`
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
|          |  1234567 |  8901234 |                  Δ1 |
| :------- | -------: | -------: | ------------------: |
| All      | 0.13 KiB | 0.16 KiB |    0.03 KiB (20.7%) |
| churros  |    0 KiB | 0.12 KiB |   0.12 KiB (100.0%) |
| burritos | 0.09 KiB |    0 KiB | -0.09 KiB (-100.0%) |
`
          .replace(/^\n/, '')
          .replace(/\n$/, '')
      );
    });

    test('does not include filtered artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.toMarkdown()).toEqual(
        `
|       |  1234567 |  8901234 |            Δ1 |
| :---- | -------: | -------: | ------------: |
| All   | 0.04 KiB | 0.04 KiB | 0 KiB (-4.4%) |
| tacos | 0.04 KiB | 0.04 KiB | 0 KiB (-4.4%) |`
          .replace(/^\n/, '')
          .replace(/\n$/, '')
      );
    });
  });

  describe('toCsv', () => {
    test('gets a CSV formatted table', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toCsv()).toEqual(
        ',1234567,8901234,Δ1\r\nAll,0.13 KiB,0.16 KiB,0.03 KiB (20.7%)\r\nchurros,0 KiB,0.12 KiB,0.12 KiB (100.0%)\r\nburritos,0.09 KiB,0 KiB,-0.09 KiB (-100.0%)\r\ntacos,0.04 KiB,0.04 KiB,0 KiB (-4.4%)'
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
        ',1234567,8901234,Δ1\r\nAll,0.13 KiB,0.16 KiB,0.03 KiB (20.7%)\r\nchurros,0 KiB,0.12 KiB,0.12 KiB (100.0%)\r\nburritos,0.09 KiB,0 KiB,-0.09 KiB (-100.0%)'
      );
    });

    test('does not include filtered artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.toCsv()).toEqual(
        ',1234567,8901234,Δ1\r\nAll,0.04 KiB,0.04 KiB,0 KiB (-4.4%)\r\ntacos,0.04 KiB,0.04 KiB,0 KiB (-4.4%)'
      );
    });
  });
});
