/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import BuildDelta from '../BuildDelta';
import { BudgetLevel, BudgetType } from '@build-tracker/types';
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
// Same as build 1 but different revision
const build1b = new Build(
  { branch: 'master', revision: '1234567abcdeg', parentRevision: '1234567abcdef', timestamp: 1234567 },
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
// Alternative to build2 with burritos
const build2b = new Build(
  { branch: 'master', revision: '8901234abcdef', parentRevision: 'abcdef', timestamp: 8901234 },
  [
    { name: 'tacos', hash: 'abc', sizes: { stat: 123, gzip: 45 } },
    { name: 'burritos', hash: 'def', sizes: { stat: 456, gzip: 90 } }
  ]
);

const artifactFilters = [/burritos/, /churros/];

describe('BuildComparator', () => {
  describe('deserialize', () => {
    test('reconstructs a Comparator from a JSON-serialized string', () => {
      const budget = { level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 100, sizeKey: 'gzip' };
      const original = new BuildComparator({
        budgets: [budget],
        builds: [build1, build2],
        artifactFilters,
        groups: [{ artifactNames: [], artifactMatch: /tacos/, budgets: [budget], name: 'tacos group' }]
      });
      const deserialized = BuildComparator.deserialize(original.serialize());
      expect(deserialized.builds).toEqual(original.builds);
      expect(deserialized.matrixGroups).toEqual(original.matrixGroups);
    });
  });

  describe('builds', () => {
    test('sorts by timestamp, then parentRevision', () => {
      const build3 = new Build(
        { branch: 'master', revision: 'abcdef', parentRevision: build1.getMetaValue('revision'), timestamp: 1234566 },
        [
          { name: 'burritos', hash: 'abc', sizes: { stat: 456, gzip: 90 } },
          { name: 'tacos', hash: 'abc', sizes: { stat: 123, gzip: 45 } }
        ]
      );
      const comparator = new BuildComparator({ builds: [build2, build3, build1] });
      expect(comparator.builds[0]).toBe(build1);
      expect(comparator.builds[1]).toBe(build3);
      expect(comparator.builds[2]).toBe(build2);
    });
  });

  describe('artifactFilters', () => {
    let comparator;
    beforeEach(() => {
      comparator = new BuildComparator({ builds: [build1, build2], artifactFilters });
    });

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

    test('handles 0 artifacts', () => {
      const comparator = new BuildComparator({ builds: [build1, build1b] });
      expect(comparator.toMarkdown({ artifactFilter: () => false })).toMatchInlineSnapshot(`
        "|     |  1234567 |  1234567 |           Δ1 |
        | :-- | -------: | -------: | -----------: |
        | All | 0.13 KiB | 0.13 KiB | 0 KiB (0.0%) |"
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

    test('includes emoji for failing artifact budgets', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2],
        artifactBudgets: {
          churros: [{ level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 100, sizeKey: 'gzip' }],
          tacos: [
            { level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 1, sizeKey: 'gzip' },
            { level: BudgetLevel.ERROR, type: BudgetType.SIZE, maximum: 30, sizeKey: 'gzip' }
          ]
        }
      });
      expect(comparator.toMarkdown()).toMatchInlineSnapshot(`
        "|          |  1234567 |  8901234 |                   Δ1 |
        | :------- | -------: | -------: | -------------------: |
        | All      | 0.13 KiB | 0.16 KiB |     0.03 KiB (20.7%) |
        | churros  |    0 KiB | 0.12 KiB | ⚠️ 0.12 KiB (100.0%) |
        | burritos | 0.09 KiB |    0 KiB |  -0.09 KiB (-100.0%) |
        | tacos    | 0.04 KiB | 0.04 KiB |     🚨 0 KiB (-4.4%) |"
      `);
    });

    test('includes error emoji for total budget failures', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2],
        budgets: [
          { level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 1, sizeKey: 'gzip' },
          { level: BudgetLevel.ERROR, type: BudgetType.SIZE, maximum: 30, sizeKey: 'gzip' }
        ]
      });
      expect(comparator.toMarkdown()).toMatchInlineSnapshot(`
        "|          |  1234567 |  8901234 |                  Δ1 |
        | :------- | -------: | -------: | ------------------: |
        | All      | 0.13 KiB | 0.16 KiB | 🚨 0.03 KiB (20.7%) |
        | churros  |    0 KiB | 0.12 KiB |   0.12 KiB (100.0%) |
        | burritos | 0.09 KiB |    0 KiB | -0.09 KiB (-100.0%) |
        | tacos    | 0.04 KiB | 0.04 KiB |       0 KiB (-4.4%) |"
      `);
    });

    test('includes warning emoji for total budget failures', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2],
        budgets: [{ level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 1, sizeKey: 'gzip' }]
      });
      expect(comparator.toMarkdown()).toMatchInlineSnapshot(`
        "|          |  1234567 |  8901234 |                  Δ1 |
        | :------- | -------: | -------: | ------------------: |
        | All      | 0.13 KiB | 0.16 KiB | ⚠️ 0.03 KiB (20.7%) |
        | churros  |    0 KiB | 0.12 KiB |   0.12 KiB (100.0%) |
        | burritos | 0.09 KiB |    0 KiB | -0.09 KiB (-100.0%) |
        | tacos    | 0.04 KiB | 0.04 KiB |       0 KiB (-4.4%) |"
      `);
    });

    test('includes hash emoji for unexpected hash changes', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2b]
      });
      expect(comparator.toMarkdown()).toMatchInlineSnapshot(`
"|          |  1234567 |  8901234 |               Δ1 |
| :------- | -------: | -------: | ---------------: |
| All      | 0.13 KiB | 0.13 KiB | #️⃣ 0 KiB (0.0%) |
| burritos | 0.09 KiB | 0.09 KiB | #️⃣ 0 KiB (0.0%) |
| tacos    | 0.04 KiB | 0.04 KiB |     0 KiB (0.0%) |"
`);
    });

    test('includes emoji for failing group budgets', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2],
        groups: [
          {
            artifactNames: ['churros', 'burritos'],
            budgets: [{ level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 1, sizeKey: 'gzip' }],
            name: 'warning'
          },
          {
            artifactNames: ['churros', 'tacos'],
            budgets: [{ level: BudgetLevel.ERROR, type: BudgetType.SIZE, maximum: 1, sizeKey: 'gzip' }],
            name: 'error'
          }
        ]
      });
      expect(comparator.toMarkdown()).toMatchInlineSnapshot(`
        "|          |  1234567 |  8901234 |                   Δ1 |
        | :------- | -------: | -------: | -------------------: |
        | All      | 0.13 KiB | 0.16 KiB |     0.03 KiB (20.7%) |
        | warning  | 0.09 KiB | 0.12 KiB |  ⚠️ 0.03 KiB (33.3%) |
        | error    | 0.04 KiB | 0.16 KiB | 🚨 0.12 KiB (262.2%) |
        | churros  |    0 KiB | 0.12 KiB |    0.12 KiB (100.0%) |
        | burritos | 0.09 KiB |    0 KiB |  -0.09 KiB (-100.0%) |
        | tacos    | 0.04 KiB | 0.04 KiB |        0 KiB (-4.4%) |"
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

  describe('summary', () => {
    test('returns a list of errors and warnings for artifacts', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2b],
        artifactBudgets: {
          churros: [{ level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 100, sizeKey: 'gzip' }],
          tacos: [
            { level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 1, sizeKey: 'gzip' },
            { level: BudgetLevel.ERROR, type: BudgetType.SIZE, maximum: 30, sizeKey: 'gzip' }
          ]
        }
      });
      expect(comparator.toSummary().join('\n')).toMatchInlineSnapshot(`
"#️⃣: \`burritos\` hash changed without any file size change
⚠️: \`tacos\` failed the gzip budget size limit of 0 KiB by 0.04 KiB
🚨: \`tacos\` failed the gzip budget size limit of 0.03 KiB by 0.01 KiB"
`);
    });

    test('returns a list of errors and warnings for groups', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2],
        budgets: [{ level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 1, sizeKey: 'gzip' }],
        groups: [
          {
            artifactNames: ['churros', 'burritos'],
            budgets: [{ level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 1, sizeKey: 'gzip' }],
            name: 'warning'
          },
          {
            artifactNames: ['churros', 'tacos'],
            budgets: [{ level: BudgetLevel.ERROR, type: BudgetType.SIZE, maximum: 1, sizeKey: 'gzip' }],
            name: 'error'
          }
        ]
      });
      expect(comparator.toSummary().join('\n')).toMatchInlineSnapshot(`
        "⚠️: \`Group \\"All\\"\` failed the gzip budget size limit of 0 KiB by 0.16 KiB
        ⚠️: \`Group \\"warning\\"\` failed the gzip budget size limit of 0 KiB by 0.12 KiB
        🚨: \`Group \\"error\\"\` failed the gzip budget size limit of 0 KiB by 0.16 KiB"
      `);
    });

    test('can render budgets without emoji', () => {
      const comparator = new BuildComparator({
        builds: [build1, build2],
        budgets: [{ level: BudgetLevel.WARN, type: BudgetType.SIZE, maximum: 1, sizeKey: 'gzip' }],
        artifactBudgets: {
          tacos: [{ level: BudgetLevel.ERROR, type: BudgetType.SIZE, maximum: 30, sizeKey: 'gzip' }]
        }
      });

      expect(comparator.toSummary(false).join('\n')).toMatchInlineSnapshot(`
        "Warning: \`Group \\"All\\"\` failed the gzip budget size limit of 0 KiB by 0.16 KiB
        Error: \`tacos\` failed the gzip budget size limit of 0.03 KiB by 0.01 KiB"
      `);
    });

    test('returns success if no failing budgets', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toSummary().join('\n')).toMatchInlineSnapshot(`"✅ No failing budgets"`);
    });

    test('can render success without emoji', () => {
      const comparator = new BuildComparator({ builds: [build1, build2] });
      expect(comparator.toSummary(false).join('\n')).toMatchInlineSnapshot(`"Success: No failing budgets"`);
    });
  });
});
