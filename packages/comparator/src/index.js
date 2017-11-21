// @flow
import AsciiTable from 'ascii-table';
import type {
  Artifact,
  Build,
  BuildDelta,
  BuildMeta,
  ComparisonMatrix,
  MatrixCell,
  TextCell,
  TotalCell,
  TotalDeltaCell,
  RevisionHeaderCell,
  RevisionDeltaCell,
  DeltaCell,
  TotalDelta
} from './types';

export const CellType = {
  ARTIFACT: 'artifact',
  DELTA: 'delta',
  REVISION_HEADER: 'revisionHeader',
  REVISION_DELTA_HEADER: 'revisionDeltaHeader',
  TEXT: 'text',
  TOTAL: 'total',
  TOTAL_DELTA: 'totalDelta'
};

const getDelta = (key: 'size' | 'gzipSize', baseArtifact: Artifact, changeArtifact: Artifact): number => {
  if (!changeArtifact) {
    if (!baseArtifact) {
      return 0;
    }
    return -baseArtifact[key];
  }

  return changeArtifact[key] - (baseArtifact ? baseArtifact[key] : 0);
};

const getPercentDelta = (key: 'size' | 'gzipSize', baseArtifact: Artifact, changeArtifact: Artifact): number => {
  if (!changeArtifact) {
    if (!baseArtifact) {
      return 0;
    }
    return 1;
  }

  return !baseArtifact ? 1 : changeArtifact[key] / baseArtifact[key];
};

const getSizeDeltas = (baseArtifact: Artifact, changeArtifact: Artifact): DeltaCell => {
  return {
    type: CellType.DELTA,
    size: getDelta('size', baseArtifact, changeArtifact),
    sizePercent: getPercentDelta('size', baseArtifact, changeArtifact),
    gzipSize: getDelta('gzipSize', baseArtifact, changeArtifact),
    gzipSizePercent: getPercentDelta('gzipSize', baseArtifact, changeArtifact)
  };
};

const getTotalArtifactSizes = (build: Build): TotalCell =>
  Object.keys(build.artifacts).reduce(
    (memo, artifactName) => ({
      type: CellType.TOTAL,
      size: memo.size + build.artifacts[artifactName].size,
      gzipSize: memo.gzipSize + build.artifacts[artifactName].gzipSize
    }),
    { size: 0, gzipSize: 0 }
  );

const getTotalSizeDeltas = (baseBuild: Build, changeBuild: Build): TotalDelta => {
  const baseSize = getTotalArtifactSizes(baseBuild);
  const changeSize = getTotalArtifactSizes(changeBuild);

  return {
    type: CellType.DELTA,
    size: baseSize.size - changeSize.size,
    sizePercent: baseSize.size / changeSize.size,
    gzipSize: baseSize.gzipSize - changeSize.gzipSize,
    gzipSizePercent: baseSize.gzipSize / changeSize.gzipSize
  };
};

const flatten = (arrays: Array<any>) => arrays.reduce((memo: Array<any>, b: any) => memo.concat(b), []);

const defaultArtifactSorter = (rowA, rowB): number => {
  return rowA > rowB ? 1 : rowB > rowA ? -1 : 0;
};

const defaultFormatRevision = (cell: RevisionHeaderCell): string => cell.revision;
const defaultFormatRevisionDelta = (cell: RevisionDeltaCell): string => `Δ${cell.deltaIndex}`;
const defaultFormatTotal = (cell: TotalCell): string => cell.gzipSize;
const defaultFormatDelta = (cell: DeltaCell): string => `${cell.gzipSize} (${cell.gzipSizePercent}%)`;

type FormattingOptions = {
  formatRevision?: (cell: RevisionHeaderCell) => string,
  formatRevisionDelta?: (cell: RevisionDeltaCell) => string,
  formatTotal?: (cell: TotalCell) => string,
  formatDelta?: (cell: DeltaCell) => string
};

export default class BuildComparator {
  builds: Array<Build>;

  _artifactSorter: Function;
  _artifactNames: Array<string>;
  _buildDeltas: Array<BuildDelta>;

  constructor(builds: Array<Build>, artifactSorter: Function = defaultArtifactSorter) {
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

  get matrixHeader(): Array<TextCell | RevisionHeaderCell | RevisionDeltaCell> {
    return [
      { type: CellType.TEXT, text: '' },
      ...flatten(
        this.buildDeltas.map(buildDelta => {
          const revision = buildDelta.meta.revision;
          const revisionIndex = this.builds.findIndex(build => build.meta.revision === revision);
          return [
            { type: CellType.REVISION_HEADER, revision },
            ...buildDelta.artifactDeltas.map((delta, i): RevisionDeltaCell => {
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

  get matrixTotal(): Array<TextCell | TotalCell | TotalDeltaCell> {
    return [
      { type: CellType.ARTIFACT, text: 'All' },
      ...flatten(this.buildDeltas.map(({ deltas }, i) => [getTotalArtifactSizes(this.builds[i]), ...deltas]))
    ];
  }

  get matrixBody(): Array<Array<MatrixCell>> {
    return this.artifactNames.sort(this._artifactSorter).map(artifactName => {
      const deltas = this.buildDeltas.map(({ artifactDeltas }, i) => [
        this.builds[i].artifacts[artifactName],
        ...artifactDeltas.map(delta => delta[artifactName])
      ]);
      return [{ type: CellType.ARTIFACT, text: artifactName }, ...flatten(deltas)];
    });
  }

  get matrix(): ComparisonMatrix {
    return [this.matrixHeader, this.matrixTotal, ...this.matrixBody];
  }

  getStringFormattedHeader(
    formatRevision: Function = defaultFormatRevision,
    formatRevisionDelta: Function = defaultFormatRevisionDelta
  ) {
    return this.matrixHeader.map(cell => {
      switch (cell.type) {
        case CellType.REVISION_HEADER:
          return formatRevision(cell);
        case CellType.REVISION_DELTA_HEADER:
          return formatRevisionDelta(cell);
        // no default
      }
    });
  }

  getStringFormattedRows(formatTotal: Function = defaultFormatTotal, formatDelta: Function = defaultFormatDelta) {
    return this.matrixBody.map(row => {
      return row.map(cell => {
        if (!cell) {
          return '';
        }
        switch (cell.type) {
          case CellType.ARTIFACT:
            return cell.text;
          case CellType.DELTA:
            return formatDelta(cell);
          case CellType.TOTAL:
          default:
            return cell ? formatTotal(cell) : '';
        }
      });
    });
  }

  getAscii({ formatRevision, formatRevisionDelta, formatTotal, formatDelta }: FormattingOptions = {}): string {
    const header = this.getStringFormattedHeader(formatRevision, formatRevisionDelta);
    const rows = this.getStringFormattedRows(formatTotal, formatDelta);

    const table = new AsciiTable('');
    table
      .setBorder('|', '-', '', '')
      .setHeading(...header)
      .addRowMatrix(rows);

    return table.toString();
  }

  getCsv({ formatRevision, formatRevisionDelta, formatTotal, formatDelta }: FormattingOptions = {}): string {
    const header = this.getStringFormattedHeader(formatRevision, formatRevisionDelta);
    const rows = this.getStringFormattedRows(formatTotal, formatDelta);

    return [header, ...rows].map(row => `${row.join(',')}`).join(`\r\n`);
  }
}
