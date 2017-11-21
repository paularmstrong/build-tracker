// @flow
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

  return !baseArtifact ? 0 : changeArtifact[key] / baseArtifact[key];
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
      { type: CellType.TEXT, text: 'All' },
      ...flatten(this.buildDeltas.map(({ deltas }, i) => [getTotalArtifactSizes(this.builds[i]), ...deltas]))
    ];
  }

  get matrixBody(): Array<MatrixCell> {
    return this.artifactNames.sort(this._artifactSorter).map(artifactName => {
      const deltas = this.buildDeltas.map(({ artifactDeltas }, i) => [
        this.builds[i].artifacts[artifactName],
        ...artifactDeltas.map(delta => delta[artifactName])
      ]);
      return [{ type: 'text', text: artifactName }, ...flatten(deltas)];
    });
  }

  get matrix(): ComparisonMatrix {
    return [this.matrixHeader, this.matrixTotal, ...this.matrixBody];
  }
}
