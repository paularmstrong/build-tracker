// @flow
import AsciiTable from 'ascii-table';
import { BuildMeta } from '@build-tracker/builds';

import type {
  BT$Artifact,
  BT$ArtifactFilters,
  BT$BodyCellType,
  BT$Build,
  BT$BuildDelta,
  BT$ComparisonMatrix,
  BT$DeltaCellType,
  BT$HeaderCellType,
  BT$RevisionCellType,
  BT$RevisionDeltaCellType,
  BT$TextCellType,
  BT$TotalCellType,
  BT$TotalDeltaCellType
} from '@build-tracker/types';

type RevisionStringFormatter = (cell: BT$RevisionCellType) => string;
type RevisionDeltaStringFormatter = (cell: BT$RevisionDeltaCellType) => string;
type TotalStringFormatter = (cell: BT$TotalCellType) => string;
type DeltaStringFormatter = (cell: BT$DeltaCellType) => string;
type RowFilter = (row: Array<BT$BodyCellType>) => boolean;

type FormattingOptions = {
  formatRevision?: RevisionStringFormatter,
  formatRevisionDelta?: RevisionDeltaStringFormatter,
  formatTotal?: TotalStringFormatter,
  formatDelta?: DeltaStringFormatter,
  rowFilter?: RowFilter
};

export const CellType = {
  ARTIFACT: 'artifact',
  DELTA: 'delta',
  REVISION_HEADER: 'revision',
  REVISION_DELTA_HEADER: 'revisionDelta',
  TEXT: 'text',
  TOTAL: 'total',
  TOTAL_DELTA: 'totalDelta'
};

const getDelta = (key: 'stat' | 'gzip', baseArtifact: BT$Artifact, changeArtifact: BT$Artifact): number => {
  if (!changeArtifact) {
    if (!baseArtifact) {
      return 0;
    }
    return -baseArtifact[key];
  }

  return changeArtifact[key] - (baseArtifact ? baseArtifact[key] : 0);
};

const getPercentDelta = (key: 'stat' | 'gzip', baseArtifact: BT$Artifact, changeArtifact: BT$Artifact): number => {
  if (!changeArtifact) {
    if (!baseArtifact) {
      return 0;
    }
    return 1;
  }

  return !baseArtifact ? 1 : changeArtifact[key] / baseArtifact[key];
};

const getSizeDeltas = (baseArtifact: BT$Artifact, changeArtifact: BT$Artifact) => {
  return {
    type: CellType.DELTA,
    stat: getDelta('stat', baseArtifact, changeArtifact),
    statPercent: getPercentDelta('stat', baseArtifact, changeArtifact),
    gzip: getDelta('gzip', baseArtifact, changeArtifact),
    gzipPercent: getPercentDelta('gzip', baseArtifact, changeArtifact)
  };
};

const getTotalArtifactSizes = (build: BT$Build, artifactFilters: BT$ArtifactFilters) =>
  Object.keys(build.artifacts)
    .filter(artifactName => !artifactFilters.some(filter => filter.test(artifactName)))
    .reduce(
      (memo, artifactName) => {
        return {
          type: CellType.TOTAL,
          stat: memo.stat + build.artifacts[artifactName].stat,
          gzip: memo.gzip + build.artifacts[artifactName].gzip
        };
      },
      { type: CellType.TOTAL, stat: 0, gzip: 0 }
    );

const getTotalSizeDeltas = (
  baseBuild: BT$Build,
  changeBuild: BT$Build,
  artifactFilters: BT$ArtifactFilters
): BT$TotalDeltaCellType => {
  const baseSize = getTotalArtifactSizes(baseBuild, artifactFilters);
  const changeSize = getTotalArtifactSizes(changeBuild, artifactFilters);

  return {
    type: CellType.TOTAL_DELTA,
    stat: baseSize.stat - changeSize.stat,
    statPercent: baseSize.stat / changeSize.stat,
    gzip: baseSize.gzip - changeSize.gzip,
    gzipPercent: baseSize.gzip / changeSize.gzip
  };
};

const flatten = (arrays: Array<any>) => arrays.reduce((memo: Array<any>, b: any) => memo.concat(b), []);

const defaultArtifactSorter = (rowA, rowB): number => {
  return rowA > rowB ? 1 : rowB > rowA ? -1 : 0;
};

const defaultFormatRevision = (cell: BT$RevisionCellType): string => cell.revision;
const defaultFormatRevisionDelta = (cell: BT$RevisionDeltaCellType): string => `Δ${cell.deltaIndex}`;
const defaultFormatTotal = (cell: BT$TotalCellType): string => `${cell.gzip}`;
const defaultFormatDelta = (cell: BT$DeltaCellType): string => `${cell.gzip} (${cell.gzipPercent}%)`;
const defaultRowFilter = (row: Array<BT$BodyCellType>): boolean => true;

const emptyArray = [];

type ComparatorOptions = {
  artifactFilters?: BT$ArtifactFilters,
  artifactSorter?: (a: string, b: string) => number,
  builds: Array<BT$Build>
};

export default class BuildComparator {
  builds: Array<BT$Build>;

  _artifactFilters: BT$ArtifactFilters;
  _artifactNames: Array<string>;
  _artifactSorter: Function;
  _buildDeltas: Array<BT$BuildDelta>;

  constructor({ artifactFilters, artifactSorter, builds }: ComparatorOptions) {
    this.builds = builds;
    this._artifactSorter = artifactSorter || defaultArtifactSorter;
    this._artifactFilters = artifactFilters || emptyArray;
  }

  get artifactNames(): Array<string> {
    if (!this._artifactNames) {
      this._artifactNames = Array.prototype.concat
        .apply([], this.builds.map(({ artifacts }) => Object.keys(artifacts)))
        .filter(
          (value, index, self) =>
            self.indexOf(value) === index && !this._artifactFilters.some(filter => filter.test(value))
        );
    }
    return this._artifactNames;
  }

  get buildDeltas(): Array<BT$BuildDelta> {
    if (!this._buildDeltas) {
      this._buildDeltas = this.builds.map((build, i) => {
        const totalDeltas = [];
        const artifactDeltas = this.builds
          .map((compareBuild, j) => {
            if (j >= i) {
              return null;
            }

            totalDeltas[j] = getTotalSizeDeltas(build, compareBuild, this._artifactFilters);

            return this.artifactNames.reduce((memo, name) => {
              const buildArtifact = build.artifacts[name];
              const compareArtifact = compareBuild.artifacts[name];
              const sizeDeltas = getSizeDeltas(compareArtifact, buildArtifact);
              return {
                ...memo,
                [name]: {
                  ...sizeDeltas,
                  hashChanged: !compareArtifact || !buildArtifact || compareArtifact.hash !== buildArtifact.hash
                }
              };
            }, {});
          })
          .filter(Boolean);

        return {
          meta: build.meta,
          artifactDeltas,
          deltas: totalDeltas
        };
      });
    }

    return this._buildDeltas;
  }

  get matrixHeader(): Array<BT$HeaderCellType> {
    return [
      { type: CellType.TEXT, text: '' },
      ...flatten(
        this.buildDeltas.map(buildDelta => {
          const revision = BuildMeta.getRevision(buildDelta);
          const revisionIndex = this.builds.findIndex(build => BuildMeta.getRevision(build) === revision);
          return [
            { type: CellType.REVISION_HEADER, revision },
            ...buildDelta.artifactDeltas.map((delta, i): BT$RevisionDeltaCellType => {
              const deltaIndex = buildDelta.artifactDeltas.length - 1 - i;
              return {
                type: CellType.REVISION_DELTA_HEADER,
                deltaIndex,
                againstRevision: BuildMeta.getRevision(this.builds[revisionIndex - deltaIndex - 1]),
                revision
              };
            })
          ];
        })
      )
    ];
  }

  get matrixTotal(): Array<BT$BodyCellType> {
    return [
      { type: CellType.ARTIFACT, text: 'All' },
      ...flatten(
        this.buildDeltas.map(({ deltas }, i) => [
          getTotalArtifactSizes(this.builds[i], this._artifactFilters),
          ...deltas
        ])
      )
    ];
  }

  get matrixBody(): Array<Array<BT$BodyCellType>> {
    return this.artifactNames.sort(this._artifactSorter).map(artifactName => {
      const cells = this.buildDeltas.map(({ artifactDeltas }, i): Array<
        BT$TextCellType | BT$TotalCellType | BT$DeltaCellType
      > => {
        const artifact = this.builds[i].artifacts[artifactName];
        return [
          {
            type: CellType.TOTAL,
            stat: artifact ? artifact.stat : 0,
            gzip: artifact ? artifact.gzip : 0
          },
          ...artifactDeltas.map(delta => delta[artifactName])
        ];
      });
      return [{ type: CellType.ARTIFACT, text: artifactName }, ...flatten(cells)];
    });
  }

  get matrix(): BT$ComparisonMatrix {
    return {
      header: this.matrixHeader,
      total: this.matrixTotal,
      body: this.matrixBody
    };
  }

  getSum(artifactNames: Array<string>): Array<BT$BodyCellType> {
    const filters = [new RegExp(`^(?!${artifactNames.join('|')})$`)];
    return [
      { type: CellType.TEXT, text: 'Sum' },
      ...flatten(
        this.builds.map((build, i) => [
          getTotalArtifactSizes(build, filters),
          ...flatten(
            this.builds
              .map((compareBuild, j) => {
                if (j >= i) {
                  return null;
                }

                return getTotalSizeDeltas(build, compareBuild, filters);
              })
              .filter(Boolean)
          )
        ])
      ).filter(cell => !cell.length)
    ];
  }

  getStringFormattedHeader(
    formatRevision: RevisionStringFormatter = defaultFormatRevision,
    formatRevisionDelta: RevisionDeltaStringFormatter = defaultFormatRevisionDelta
  ): Array<string> {
    return this.matrixHeader.map(cell => {
      switch (cell.type) {
        case CellType.REVISION_HEADER:
          return formatRevision(cell);
        case CellType.REVISION_DELTA_HEADER:
          return formatRevisionDelta(cell);
        default:
          return '';
      }
    });
  }

  getStringFormattedRows(
    formatTotal: TotalStringFormatter = defaultFormatTotal,
    formatDelta: DeltaStringFormatter = defaultFormatDelta,
    rowFilter: RowFilter = defaultRowFilter
  ): Array<Array<string>> {
    return this.matrixBody.filter(rowFilter).map((row): Array<string> => {
      return row.map((cell): string => {
        switch (cell.type) {
          case CellType.ARTIFACT:
            return cell.text || '';
          case CellType.DELTA:
            return formatDelta(cell);
          case CellType.TOTAL:
            return formatTotal(cell);
          default:
            return '';
        }
      });
    });
  }

  getAscii({
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

    const table = new AsciiTable('');
    table
      .setBorder('|', '-', '', '')
      .setHeading(...header)
      .addRowMatrix(rows);

    return table.toString();
  }

  getCsv({ formatRevision, formatRevisionDelta, formatTotal, formatDelta, rowFilter }: FormattingOptions = {}): string {
    const header = this.getStringFormattedHeader(formatRevision, formatRevisionDelta);
    const rows = this.getStringFormattedRows(formatTotal, formatDelta, rowFilter);

    return [header, ...rows].map(row => `${row.join(',')}`).join(`\r\n`);
  }
}
