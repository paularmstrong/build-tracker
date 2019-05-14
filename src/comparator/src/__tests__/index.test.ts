/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import BuildDelta from '../BuildDelta';
import BuildComparator, {
  ArtifactRow,
  DeltaCell,
  RevisionCell,
  RevisionDeltaCell,
  TotalCell,
  TotalDeltaCell
} from '..';

const build1 = new Build(
  { branch: 'master', revision: '1234567abcdef', parentRevision: 'abcdef', timestamp: 1234567 },
  [
    { name: 'burritos', hash: 'abc', sizes: { stat: 456, gzip: 90 } },
    { name: 'tacos', hash: 'abc', sizes: { stat: 123, gzip: 45 } }
  ]
);

const build2 = new Build(
  { branch: 'master', revision: '8901234abcdef', parentRevision: 'abcdef', timestamp: 8901234 },
  [
    { name: 'tacos', hash: 'abc', sizes: { stat: 123, gzip: 43 } },
    { name: 'churros', hash: 'def', sizes: { stat: 469, gzip: 120 } }
  ]
);

const artifactFilters = [/burritos/, /churros/];

describe('BuildComparator', () => {
  describe('artifactFilters', () => {
    const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });

    test('filters artifact sizes from the totals', () => {
      const [, build1Total, build2Total, deltaTotal] = comparator.matrixGroups[0];
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

    test('filters artifacts from the matrixArtifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.matrixArtifacts).toHaveLength(1);
      expect(comparator.matrixArtifacts[0][0]).toMatchObject({ text: 'tacos' });
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

    test('returns an empty array if there are no builds', () => {
      const comparator = new BuildComparator({ builds: [] });
      expect(comparator.artifactNames).toEqual([]);
    });
  });

  describe('sizeKeys', () => {
    test('gets a list of size keys available', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.sizeKeys).toEqual(['gzip', 'stat']);
    });

    test('throws an error if some builds have size keys that others do not', () => {
      expect(() => {
        new BuildComparator({
          builds: [new Build(build1.meta, [{ name: 'tacos', hash: 'abc', sizes: { tacos: 123 } }]), build2]
        });
      }).toThrowErrorMatchingInlineSnapshot(`"builds provided do not have same size keys for artifacts"`);
    });

    test('returns an empty array if there are no builds', () => {
      const comparator = new BuildComparator({ builds: [] });
      expect(comparator.sizeKeys).toEqual([]);
    });

    test('returns an empty array if there are no artifacts', () => {
      const comparator = new BuildComparator({
        builds: [new Build(build1.meta, [])]
      });
      expect(comparator.sizeKeys).toEqual([]);
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

    test('returns an empty array if there are no builds', () => {
      const comparator = new BuildComparator({ builds: [] });
      expect(comparator.buildDeltas).toEqual([]);
    });
  });

  describe('matrixHeader', () => {
    test('starts with empty text cell', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrixHeader[0]).toEqual({
        type: 'text',
        text: ''
      });
    });

    test('includes both revision cells', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrixHeader[1]).toEqual({
        type: 'revision',
        revision: build1.getMetaValue('revision')
      });
      expect(comparator.matrixHeader[2]).toEqual({
        type: 'revision',
        revision: build2.getMetaValue('revision')
      });
    });

    test('includes a revision delta cell', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrixHeader[3]).toEqual({
        type: 'revisionDelta',
        deltaIndex: 1,
        againstRevision: build1.getMetaValue('revision'),
        revision: build2.getMetaValue('revision')
      });
    });
  });

  describe('matrixArtifacts', () => {
    test('includes a row for each artifact', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrixArtifacts.map(r => r[0])).toEqual([
        { type: 'artifact', text: 'churros' },
        { type: 'artifact', text: 'burritos' },
        { type: 'artifact', text: 'tacos' }
      ]);
    });

    test('includes totals for each artifact', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrixArtifacts[2][1]).toEqual({
        type: 'total',
        name: 'tacos',
        sizes: { gzip: 45, stat: 123 }
      });
      expect(comparator.matrixArtifacts[2][2]).toEqual({
        type: 'total',
        name: 'tacos',
        sizes: { gzip: 43, stat: 123 }
      });
    });

    test('includes deltas for each artifact', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrixArtifacts[2][3]).toMatchObject({
        type: 'delta',
        hashChanged: false,
        name: 'tacos',
        percents: { gzip: -0.044444444444444446, stat: 0 },
        sizes: { gzip: -2, stat: 0 }
      });
    });
  });

  describe('matrixGroups', () => {
    test('includes an artifact cell for All', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrixGroups[0][0]).toEqual({
        type: 'group',
        text: 'All',
        artifactNames: ['churros', 'burritos', 'tacos']
      });
    });

    test('includes an total cell for each build', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrixGroups[0][1]).toEqual({
        type: 'total',
        name: 'All',
        sizes: { gzip: 135, stat: 579 }
      });
      expect(comparator.matrixGroups[0][2]).toEqual({
        type: 'total',
        name: 'All',
        sizes: { gzip: 163, stat: 592 }
      });
    });

    test('includes an total delta cell', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.matrixGroups[0][3]).toEqual({
        type: 'totalDelta',
        name: 'All',
        budgets: [],
        failingBudgets: [],
        hashChanged: true,
        sizes: { gzip: 28, stat: 13 },
        percents: { gzip: 0.2074074074074074, stat: 0.022452504317789293 }
      });
    });

    test('includes totals for each group', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2],
        groups: [{ name: 'stuff', artifactNames: ['churros', 'burritos'] }]
      });
      expect(comparator.matrixGroups[1][1]).toEqual({
        type: 'total',
        name: 'stuff',
        sizes: { gzip: 90, stat: 456 }
      });
      expect(comparator.matrixGroups[1][2]).toEqual({
        type: 'total',
        name: 'stuff',
        sizes: { gzip: 120, stat: 469 }
      });
    });

    test('includes deltas for each group', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2],
        groups: [{ name: 'stuff', artifactNames: ['churros', 'burritos'] }]
      });
      expect(comparator.matrixGroups[1][3]).toEqual({
        type: 'totalDelta',
        name: 'stuff',
        hashChanged: true,
        budgets: [],
        failingBudgets: [],
        percents: { gzip: 0.3333333333333333, stat: 0.02850877192982456 },
        sizes: { gzip: 30, stat: 13 }
      });
    });

    test('includes data for artifactMatch regex', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2],
        groups: [{ name: 'stuff', artifactNames: ['burritos'], artifactMatch: /^tac/ }]
      });
      expect(comparator.matrixGroups[1][1]).toEqual({
        type: 'total',
        name: 'stuff',
        sizes: { gzip: 135, stat: 579 }
      });
      expect(comparator.matrixGroups[1][2]).toEqual({
        type: 'total',
        name: 'stuff',
        sizes: { gzip: 43, stat: 123 }
      });
      expect(comparator.matrixGroups[1][3]).toEqual({
        type: 'totalDelta',
        name: 'stuff',
        hashChanged: true,
        budgets: [],
        failingBudgets: [],
        percents: { gzip: -0.6814814814814815, stat: -0.7875647668393783 },
        sizes: { gzip: -92, stat: -456 }
      });
    });
  });

  describe('toJSON', () => {
    test('includes the header', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toJSON().header).toBe(comparator.matrixHeader);
    });

    test('includes the groups', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2],
        groups: [{ name: 'yum', artifactNames: ['burritos', 'tacos'] }]
      });
      expect(comparator.toJSON().groups).toBe(comparator.matrixGroups);
    });

    test('includes the artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toJSON().artifacts).toBe(comparator.matrixArtifacts);
    });
  });

  describe('toMarkdown', () => {
    test('gets a markdown-formatted table', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toMarkdown()).toMatchInlineSnapshot(`
"|          |  1234567 |  8901234 |                  Δ1 |
| :------- | -------: | -------: | ------------------: |
| All      | 0.13 KiB | 0.16 KiB |    0.03 KiB (20.7%) |
| churros  |    0 KiB | 0.12 KiB |   0.12 KiB (100.0%) |
| burritos | 0.09 KiB |    0 KiB | -0.09 KiB (-100.0%) |
| tacos    | 0.04 KiB | 0.04 KiB |       0 KiB (-4.4%) |"
`);
    });

    test('can specify a different size key', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toMarkdown({ sizeKey: 'stat' })).toMatchInlineSnapshot(`
"|          |  1234567 |  8901234 |                  Δ1 |
| :------- | -------: | -------: | ------------------: |
| All      | 0.57 KiB | 0.58 KiB |     0.01 KiB (2.2%) |
| churros  |    0 KiB | 0.46 KiB |   0.46 KiB (100.0%) |
| burritos | 0.45 KiB |    0 KiB | -0.45 KiB (-100.0%) |
| tacos    | 0.12 KiB | 0.12 KiB |        0 KiB (0.0%) |"
`);
    });

    test('can filter artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      const artifactFilter = (row): boolean => {
        return row.some(cell => {
          if (cell.sizes && 'gzip' in cell.sizes) {
            return cell.sizes.gzip > 50;
          }
          return false;
        });
      };
      expect(comparator.toMarkdown({ artifactFilter })).toMatchInlineSnapshot(`
"|          |  1234567 |  8901234 |                  Δ1 |
| :------- | -------: | -------: | ------------------: |
| All      | 0.13 KiB | 0.16 KiB |    0.03 KiB (20.7%) |
| churros  |    0 KiB | 0.12 KiB |   0.12 KiB (100.0%) |
| burritos | 0.09 KiB |    0 KiB | -0.09 KiB (-100.0%) |"
`);
    });

    test('does not include filtered artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.toMarkdown()).toMatchInlineSnapshot(`
"|       |  1234567 |  8901234 |            Δ1 |
| :---- | -------: | -------: | ------------: |
| All   | 0.04 KiB | 0.04 KiB | 0 KiB (-4.4%) |
| tacos | 0.04 KiB | 0.04 KiB | 0 KiB (-4.4%) |"
`);
    });

    test('accepts formatting and filtering options', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      const formatRevision = (cell: RevisionCell): string => cell.revision.substring(0, 2);
      const formatRevisionDelta = (cell: RevisionDeltaCell): string => `d${cell.deltaIndex}`;
      // @ts-ignore
      const formatTotal = (cell: TotalCell): string => cell.sizes.stat;
      // @ts-ignore
      const formatDelta = (cell: DeltaCell | TotalDeltaCell): string => cell.percents.gzip.toFixed(2);
      // @ts-ignore
      const artifactFilter = (row: ArtifactRow): boolean => row[0].text !== 'burritos';
      expect(comparator.toMarkdown({ formatRevision, formatRevisionDelta, formatTotal, formatDelta, artifactFilter }))
        .toMatchInlineSnapshot(`
"|         |  12 |  89 |    d1 |
| :------ | --: | --: | ----: |
| All     | 579 | 592 |  0.21 |
| churros |   0 | 469 |  1.00 |
| tacos   | 123 | 123 | -0.04 |"
`);
    });
  });

  describe('toCsv', () => {
    test('gets a CSV formatted table', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toCsv()).toMatchInlineSnapshot(`
",1234567,8901234,Δ1
All,0.13 KiB,0.16 KiB,0.03 KiB (20.7%)
churros,0 KiB,0.12 KiB,0.12 KiB (100.0%)
burritos,0.09 KiB,0 KiB,-0.09 KiB (-100.0%)
tacos,0.04 KiB,0.04 KiB,0 KiB (-4.4%)"
`);
    });

    test('can specify a different size key', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toCsv({ sizeKey: 'stat' })).toMatchInlineSnapshot(`
",1234567,8901234,Δ1
All,0.57 KiB,0.58 KiB,0.01 KiB (2.2%)
churros,0 KiB,0.46 KiB,0.46 KiB (100.0%)
burritos,0.45 KiB,0 KiB,-0.45 KiB (-100.0%)
tacos,0.12 KiB,0.12 KiB,0 KiB (0.0%)"
`);
    });

    test('can filter artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      const artifactFilter = (row): boolean => {
        return row.some(cell => {
          if (cell.sizes && 'gzip' in cell.sizes) {
            return cell.sizes.gzip > 50;
          }
          return false;
        });
      };
      expect(comparator.toCsv({ artifactFilter })).toMatchInlineSnapshot(`
",1234567,8901234,Δ1
All,0.13 KiB,0.16 KiB,0.03 KiB (20.7%)
churros,0 KiB,0.12 KiB,0.12 KiB (100.0%)
burritos,0.09 KiB,0 KiB,-0.09 KiB (-100.0%)"
`);
    });

    test('does not include filtered artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
      expect(comparator.toCsv()).toMatchInlineSnapshot(`
",1234567,8901234,Δ1
All,0.04 KiB,0.04 KiB,0 KiB (-4.4%)
tacos,0.04 KiB,0.04 KiB,0 KiB (-4.4%)"
`);
    });

    test('accepts formatting and filtering options', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      const formatRevision = (cell: RevisionCell): string => cell.revision.substring(0, 2);
      const formatRevisionDelta = (cell: RevisionDeltaCell): string => `d${cell.deltaIndex}`;
      // @ts-ignore
      const formatTotal = (cell: TotalCell): string => cell.sizes.stat;
      // @ts-ignore
      const formatDelta = (cell: DeltaCell | TotalDeltaCell): string => cell.percents.gzip.toFixed(2);
      // @ts-ignore
      const artifactFilter = (row: ArtifactRow): boolean => row[0].text !== 'burritos';
      expect(comparator.toCsv({ formatRevision, formatRevisionDelta, formatTotal, formatDelta, artifactFilter }))
        .toMatchInlineSnapshot(`
",12,89,d1
All,579,592,0.21
churros,0,469,1.00
tacos,123,123,-0.04"
`);
    });
  });
});
