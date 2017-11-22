// @flow
import AsciiTable from 'ascii-table';
export type BuildMeta = {|
  revision: string,
  timestamp: number
|};

export type Artifact = {|
  hash: string,
  name: string,
  size: number,
  gzipSize: number
|};

export type Build = {|
  meta: BuildMeta,
  artifacts: { [name: string]: Artifact }
|};

export type BuildDelta = {|
  meta: BuildMeta,
  artifactDeltas: Array<{ [name: string]: DeltaCellType }>,
  deltas: Array<TotalDeltaCellType>
|};

export type TextCellType = {|
  type: 'text',
  text: string
|};

export type DeltaCellType = {|
  type: 'delta',
  size: number,
  sizePercent: number,
  gzipSize: number,
  gzipSizePercent: number,
  hashChanged: boolean
|};

export type TotalCellType = {|
  type: 'total',
  size: number,
  gzipSize: number
|};

export type TotalDeltaCellType = {|
  type: 'totalDelta',
  size: number,
  sizePercent: number,
  gzipSize: number,
  gzipSizePercent: number
|};

export type RevisionCellType = {|
  type: 'revision',
  revision: string
|};

export type RevisionDeltaCellType = {|
  type: 'revisionDelta',
  revision: string,
  deltaIndex: number,
  againstRevision: string
|};

export type ArtifactCellType = {|
  type: 'artifact',
  text: string
|};

export type BodyCellType = ArtifactCellType | DeltaCellType | TotalCellType;
export type HeaderCellType = TextCellType | RevisionCellType | RevisionDeltaCellType;

export type ComparisonMatrix = {
  header: Array<HeaderCellType>,
  total: Array<BodyCellType>,
  body: Array<Array<BodyCellType>>
};

type RevisionStringFormatter = (cell: RevisionCellType) => string;
type RevisionDeltaStringFormatter = (cell: RevisionDeltaCellType) => string;
type TotalStringFormatter = (cell: TotalCellType) => string;
type DeltaStringFormatter = (cell: DeltaCellType) => string;

type FormattingOptions = {
  formatRevision?: RevisionStringFormatter,
  formatRevisionDelta?: RevisionDeltaStringFormatter,
  formatTotal?: TotalStringFormatter,
  formatDelta?: DeltaStringFormatter
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

const getSizeDeltas = (baseArtifact: Artifact, changeArtifact: Artifact) => {
  return {
    type: CellType.DELTA,
    size: getDelta('size', baseArtifact, changeArtifact),
    sizePercent: getPercentDelta('size', baseArtifact, changeArtifact),
    gzipSize: getDelta('gzipSize', baseArtifact, changeArtifact),
    gzipSizePercent: getPercentDelta('gzipSize', baseArtifact, changeArtifact)
  };
};

const getTotalArtifactSizes = (build: Build) =>
  Object.keys(build.artifacts).reduce(
    (memo, artifactName) => ({
      type: CellType.TOTAL,
      size: memo.size + build.artifacts[artifactName].size,
      gzipSize: memo.gzipSize + build.artifacts[artifactName].gzipSize
    }),
    { type: CellType.TOTAL, size: 0, gzipSize: 0 }
  );

const getTotalSizeDeltas = (baseBuild: Build, changeBuild: Build): TotalDeltaCellType => {
  const baseSize = getTotalArtifactSizes(baseBuild);
  const changeSize = getTotalArtifactSizes(changeBuild);

  return {
    type: CellType.TOTAL_DELTA,
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

const defaultFormatRevision = (cell: RevisionCellType): string => cell.revision;
const defaultFormatRevisionDelta = (cell: RevisionDeltaCellType): string => `Δ${cell.deltaIndex}`;
const defaultFormatTotal = (cell: TotalCellType): string => `${cell.gzipSize}`;
const defaultFormatDelta = (cell: DeltaCellType): string => `${cell.gzipSize} (${cell.gzipSizePercent}%)`;

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
      const deltas = this.buildDeltas.map(({ artifactDeltas }, i): Array<
        TextCellType | TotalCellType | DeltaCellType
      > => {
        const artifact = this.builds[i].artifacts[artifactName];
        return [
          {
            type: CellType.TOTAL,
            size: artifact.size,
            gzipSize: artifact.gzipSize
          },
          ...artifactDeltas.map(delta => delta[artifactName])
        ];
      });
      return [{ type: CellType.ARTIFACT, text: artifactName }, ...flatten(deltas)];
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
    formatDelta: DeltaStringFormatter = defaultFormatDelta
  ): Array<Array<string>> {
    return this.matrixBody.map((row): Array<string> => {
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
