// @flow
import AsciiTable from 'ascii-table';

import type {
  Artifact,
  BodyCellType,
  Build,
  BuildDelta,
  ComparisonMatrix,
  DeltaCellType,
  HeaderCellType,
  RevisionCellType,
  RevisionDeltaCellType,
  TextCellType,
  TotalCellType,
  TotalDeltaCellType
} from '@build-tracker/flowtypes';

type RevisionStringFormatter = (cell: RevisionCellType) => string;
type RevisionDeltaStringFormatter = (cell: RevisionDeltaCellType) => string;
type TotalStringFormatter = (cell: TotalCellType) => string;
type DeltaStringFormatter = (cell: DeltaCellType) => string;
type RowFilter = (row: Array<BodyCellType>) => boolean;

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

const getDelta = (key: 'stat' | 'gzip', baseArtifact: Artifact, changeArtifact: Artifact): number => {
  if (!changeArtifact) {
    if (!baseArtifact) {
      return 0;
    }
    return -baseArtifact[key];
  }

  return changeArtifact[key] - (baseArtifact ? baseArtifact[key] : 0);
};

const getPercentDelta = (key: 'stat' | 'gzip', baseArtifact: Artifact, changeArtifact: Artifact): number => {
  if (!changeArtifact) {
    if (!baseArtifact) {
      return 0;
    }
    return 1;
  }

  return !baseArtifact ? 1 : changeArtifact[key] / baseArtifact[key];
};

const getSizeDeltas = (baseArtifact: Artifact, changeArtifact: Artifact) => {
  return {
    type: CellType.DELTA,
    stat: getDelta('stat', baseArtifact, changeArtifact),
    statPercent: getPercentDelta('stat', baseArtifact, changeArtifact),
    gzip: getDelta('gzip', baseArtifact, changeArtifact),
    gzipPercent: getPercentDelta('gzip', baseArtifact, changeArtifact)
  };
};

const getTotalArtifactSizes = (build: Build) =>
  Object.keys(build.artifacts).reduce(
    (memo, artifactName) => ({
      type: CellType.TOTAL,
      stat: memo.stat + build.artifacts[artifactName].stat,
      gzip: memo.gzip + build.artifacts[artifactName].gzip
    }),
    { type: CellType.TOTAL, stat: 0, gzip: 0 }
  );

const getTotalSizeDeltas = (baseBuild: Build, changeBuild: Build): TotalDeltaCellType => {
  const baseSize = getTotalArtifactSizes(baseBuild);
  const changeSize = getTotalArtifactSizes(changeBuild);

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

const defaultFormatRevision = (cell: RevisionCellType): string => cell.revision;
const defaultFormatRevisionDelta = (cell: RevisionDeltaCellType): string => `Δ${cell.deltaIndex}`;
const defaultFormatTotal = (cell: TotalCellType): string => `${cell.gzip}`;
const defaultFormatDelta = (cell: DeltaCellType): string => `${cell.gzip} (${cell.gzipPercent}%)`;
const defaultRowFilter = (row: Array<BodyCellType>): boolean => true;

export default class BuildComparator {
  builds: Array<Build>;

  _artifactSorter: Function;
  _artifactNames: Array<string>;
  _buildDeltas: Array<BuildDelta>;

  constructor(builds: Array<Build>, artifactSorter: (a: string, b: string) => number = defaultArtifactSorter) {
    this.builds = builds;
    this._artifactSorter = artifactSorter;
  }

  get artifactNames(): Array<string> {
    if (!this._artifactNames) {
      this._artifactNames = Array.prototype.concat
        .apply([], this.builds.map(({ artifacts }) => Object.keys(artifacts)))
        .filter((value, index, self) => self.indexOf(value) === index);
    }
    return this._artifactNames;
  }

  get buildDeltas(): Array<BuildDelta> {
    if (!this._buildDeltas) {
      return this.builds.map((build, i) => {
        const totalDeltas = [];
        const artifactDeltas = this.builds
          .map((compareBuild, j) => {
            if (j >= i) {
              return null;
            }

            totalDeltas[j] = getTotalSizeDeltas(build, compareBuild);

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

  get matrixHeader(): Array<HeaderCellType> {
    return [
      { type: CellType.TEXT, text: '' },
      ...flatten(
        this.buildDeltas.map(buildDelta => {
          const revision = buildDelta.meta.revision;
          const revisionIndex = this.builds.findIndex(build => build.meta.revision === revision);
          return [
            { type: CellType.REVISION_HEADER, revision },
            ...buildDelta.artifactDeltas.map((delta, i): RevisionDeltaCellType => {
              const deltaIndex = buildDelta.artifactDeltas.length - 1 - i;
              return {
                type: CellType.REVISION_DELTA_HEADER,
                deltaIndex,
                againstRevision: this.builds[revisionIndex - deltaIndex - 1].meta.revision,
                revision
              };
            })
          ];
        })
      )
    ];
  }

  get matrixTotal(): Array<BodyCellType> {
    return [
      { type: CellType.ARTIFACT, text: 'All' },
      ...flatten(this.buildDeltas.map(({ deltas }, i) => [getTotalArtifactSizes(this.builds[i]), ...deltas]))
    ];
  }

  get matrixBody(): Array<Array<BodyCellType>> {
    return this.artifactNames.sort(this._artifactSorter).map(artifactName => {
      const cells = this.buildDeltas.map(({ artifactDeltas }, i): Array<
        TextCellType | TotalCellType | DeltaCellType
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

  get matrix(): ComparisonMatrix {
    return {
      header: this.matrixHeader,
      total: this.matrixTotal,
      body: this.matrixBody
    };
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
