import { ArtifactFilters } from '@build-tracker/types';
import Build from '@build-tracker/build';
import BuildDelta from './BuildDelta';
import markdownTable from 'markdown-table';

export interface ArtifactSizes {
  [key: string]: number;
}

export enum CellType {
  TEXT = 'text',
  DELTA = 'delta',
  TOTAL = 'total',
  TOTAL_DELTA = 'totalDelta',
  REVISION = 'revision',
  REVISION_DELTA = 'revisionDelta',
  ARTIFACT = 'artifact'
}

export interface TextCell {
  type: CellType.TEXT;
  text: string;
}

export interface DeltaCell {
  type: CellType.DELTA;
  sizes: ArtifactSizes;
  name?: string;
  hashChanged: boolean;
}

export interface TotalCell {
  type: CellType.TOTAL;
  sizes: ArtifactSizes;
}

export interface TotalDeltaCell {
  type: CellType.TOTAL_DELTA;
  sizes: ArtifactSizes;
}

export interface RevisionCell {
  type: CellType.REVISION;
  revision: string;
}

export interface RevisionDeltaCell {
  type: CellType.REVISION_DELTA;
  revision: string;
  deltaIndex: number;
  againstRevision: string;
}

export interface ArtifactCell {
  type: CellType.ARTIFACT;
  text: string;
}

export type BodyCell = ArtifactCell | DeltaCell | TotalCell | TextCell;
export type HeaderCell = TextCell | RevisionCell | RevisionDeltaCell;

export interface ComparisonMatrix {
  header: Array<HeaderCell>;
  total: Array<BodyCell>;
  body: Array<Array<BodyCell>>;
}

type RevisionStringFormatter = (cell: RevisionCell) => string;
type RevisionDeltaStringFormatter = (cell: RevisionDeltaCell) => string;
type TotalStringFormatter = (cell: TotalCell) => string;
type DeltaStringFormatter = (cell: DeltaCell) => string;
type RowFilter = (row: Array<BodyCell>) => boolean;

interface FormattingOptions {
  formatRevision?: RevisionStringFormatter;
  formatRevisionDelta?: RevisionDeltaStringFormatter;
  formatTotal?: TotalStringFormatter;
  formatDelta?: DeltaStringFormatter;
  rowFilter?: RowFilter;
}

const emptyArtifact = Object.freeze({
  name: '',
  hash: '',
  sizes: {}
});

const getTotalArtifactSizes = (build: Build, artifactFilters: ArtifactFilters): TotalCell =>
  // @ts-ignore reducing doesn't seem to make typescript happy
  build.artifactNames
    .filter(artifactName => !artifactFilters.some(filter => filter.test(artifactName)))
    .reduce(
      (totalMemo, artifactName): TotalCell => {
        return {
          type: CellType.TOTAL,
          sizes: Object.entries(build.getArtifact(artifactName).sizes).reduce((memo, [key, value]) => {
            if (!memo[key]) {
              memo[key] = 0;
            }
            memo[key] = memo[key] + value;
            return memo;
          }, totalMemo.sizes)
        };
      },
      { type: CellType.TOTAL, sizes: {} }
    );

/* eslint-disable @typescript-eslint/no-explicit-any */
const flatten = (arrays: Array<any>): Array<any> => arrays.reduce((memo: Array<any>, b: any) => memo.concat(b), []);
/* eslint-enable @typescript-eslint/no-explicit-any */

const defaultArtifactSorter = (rowA, rowB): number => {
  return rowA > rowB ? 1 : rowB > rowA ? -1 : 0;
};

const defaultFormatRevision = (cell: RevisionCell): string => cell.revision;
const defaultFormatRevisionDelta = (cell: RevisionDeltaCell): string => `Δ${cell.deltaIndex}`;
const defaultFormatTotal = (cell: TotalCell): string => `${cell.sizes.gzip || 0}`;
const defaultFormatDelta = (cell: DeltaCell): string =>
  `${cell.sizes.gzip || 0} (${((cell.sizes.gzipPercent || 1) * 100).toFixed(1)}%)`;
const defaultRowFilter = (): boolean => true;

/* eslint-disable @typescript-eslint/no-explicit-any */
const instanceOfCell = <C>(cell: any, type: CellType): cell is C => {
  return cell.type === type;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const emptyArray = [];

interface ComparatorOptions {
  artifactFilters?: ArtifactFilters;
  artifactSorter?: (a: string, b: string) => number;
  builds: Array<Build>;
}

export default class BuildComparator {
  public builds: Array<Build>;

  private _artifactFilters: ArtifactFilters;
  private _artifactNames: Array<string>;
  private _artifactSorter: (a, b) => number;
  private _buildDeltas: Array<Array<BuildDelta>>;

  public constructor({ artifactFilters, artifactSorter, builds }: ComparatorOptions) {
    this.builds = builds;
    this._artifactSorter = artifactSorter || defaultArtifactSorter;
    this._artifactFilters = artifactFilters || emptyArray;
  }

  public get artifactNames(): Array<string> {
    if (!this._artifactNames) {
      this._artifactNames = Array.prototype.concat
        .apply([], this.builds.map(build => build.artifactNames))
        .filter(
          (value, index, self) =>
            self.indexOf(value) === index && !this._artifactFilters.some(filter => filter.test(value))
        );
    }
    return this._artifactNames;
  }

  public get buildDeltas(): Array<Array<BuildDelta>> {
    if (!this._buildDeltas) {
      this._buildDeltas = this.builds.map((baseBuild, i) => {
        return this.builds.slice(0, i).map(prevBuild => {
          return new BuildDelta(baseBuild, prevBuild, this._artifactFilters);
        });
      });
    }

    return this._buildDeltas;
  }

  public get matrixHeader(): Array<HeaderCell> {
    return [
      { type: CellType.TEXT, text: '' },
      ...flatten(
        this.buildDeltas.map((buildDeltas, buildIndex) => {
          const revision = this.builds[buildIndex].getMetaValue('revision');
          return [
            { type: CellType.REVISION, revision },
            ...buildDeltas.map((buildDelta, deltaIndex) => ({
              type: CellType.REVISION_DELTA,
              deltaIndex: deltaIndex + 1,
              againstRevision: buildDelta.getMetaValue('revision'),
              revision
            }))
          ];
        })
      )
    ];
  }

  public get matrixTotal(): Array<BodyCell> {
    return [
      { type: CellType.ARTIFACT, text: 'All' },
      ...flatten(
        this.buildDeltas.map((buildDeltas, i) => [
          {
            sizes: this.builds[i].getTotals(this._artifactFilters),
            type: CellType.TOTAL
          },
          ...buildDeltas.map(buildDelta => ({
            ...buildDelta.totalDelta,
            type: CellType.TOTAL_DELTA
          }))
        ])
      )
    ];
  }

  public get matrixBody(): Array<Array<BodyCell>> {
    return this.artifactNames.sort(this._artifactSorter).map(artifactName => {
      const cells = this.buildDeltas.map(
        (buildDeltas, i): Array<TextCell | TotalCell | DeltaCell> => {
          const artifact = this.builds[i].getArtifact(artifactName);
          return [
            {
              ...(artifact ? artifact : emptyArtifact),
              type: CellType.TOTAL
            },
            // @ts-ignore
            ...buildDeltas.map(buildDelta => ({
              ...buildDelta.getArtifactDelta(artifactName),
              type: CellType.DELTA
            }))
          ];
        }
      );
      return [{ type: CellType.ARTIFACT, text: artifactName }, ...flatten(cells)];
    });
  }

  public getSum(artifactNames: Array<string>): Array<BodyCell> {
    const filters = [new RegExp(`^(?!(${artifactNames.join('|')})$).*$`)];
    return [
      { type: CellType.TEXT, text: 'Sum' },
      ...flatten(
        this.builds.map((changeBuild, buildIndex) => [
          getTotalArtifactSizes(changeBuild, filters),
          ...flatten(this.buildDeltas[buildIndex].map(buildDelta => buildDelta.totalDelta))
        ])
      ).filter(cell => !cell.length)
    ];
  }

  public getStringFormattedHeader(
    formatRevision: RevisionStringFormatter = defaultFormatRevision,
    formatRevisionDelta: RevisionDeltaStringFormatter = defaultFormatRevisionDelta
  ): Array<string> {
    return this.matrixHeader.map(cell => {
      if (instanceOfCell<RevisionCell>(cell, CellType.REVISION)) {
        return formatRevision(cell);
      }
      if (instanceOfCell<RevisionDeltaCell>(cell, CellType.REVISION_DELTA)) {
        return formatRevisionDelta(cell);
      }
      return '';
    });
  }

  public getStringFormattedRows(
    formatTotal: TotalStringFormatter = defaultFormatTotal,
    formatDelta: DeltaStringFormatter = defaultFormatDelta,
    rowFilter: RowFilter = defaultRowFilter
  ): Array<Array<string>> {
    return this.matrixBody.filter(rowFilter).map(
      (row): Array<string> => {
        return row.map(
          (cell): string => {
            if (instanceOfCell<ArtifactCell>(cell, CellType.ARTIFACT)) {
              return cell.text || '';
            }
            if (instanceOfCell<DeltaCell>(cell, CellType.DELTA)) {
              return formatDelta(cell);
            }
            if (instanceOfCell<TotalCell>(cell, CellType.TOTAL)) {
              return formatTotal(cell);
            }
            return '';
          }
        );
      }
    );
  }

  public toJSON(): ComparisonMatrix {
    return {
      header: this.matrixHeader,
      total: this.matrixTotal,
      body: this.matrixBody
    };
  }

  public toMarkdown({
    formatRevision,
    formatRevisionDelta,
    formatTotal,
    formatDelta,
    rowFilter
  }: FormattingOptions = {}): string {
    const header = this.getStringFormattedHeader(formatRevision, formatRevisionDelta);
    const rows = this.getStringFormattedRows(formatTotal, formatDelta, rowFilter);
    if (rows.length === 0) {
      return '';
    }

    return markdownTable([header, ...rows], { align: rows[0].map((_, i) => (i === 0 ? 'l' : 'r')) });
  }

  public toCsv({
    formatRevision,
    formatRevisionDelta,
    formatTotal,
    formatDelta,
    rowFilter
  }: FormattingOptions = {}): string {
    const header = this.getStringFormattedHeader(formatRevision, formatRevisionDelta);
    const rows = this.getStringFormattedRows(formatTotal, formatDelta, rowFilter);

    return [header, ...rows].map(row => `${row.join(',')}`).join(`\r\n`);
  }
}
