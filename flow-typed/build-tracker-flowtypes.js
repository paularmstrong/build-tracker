declare module 'build-tracker-flowtypes' {
  /**
   * Generic Types
   */

  declare type BuildMeta = {
    branch?: string,
    revision: string,
    timestamp: number
  };

  declare type Artifact = {
    hash: string,
    name: string,
    size: number,
    gzipSize: number
  };

  declare type Build = {|
    meta: BuildMeta,
    artifacts: { [name: string]: Artifact }
  |};

  /**
   * Comparison Matrix
   */

  declare type BuildDelta = {|
    meta: BuildMeta,
    artifactDeltas: Array<{ [name: string]: DeltaCellType }>,
    deltas: Array<TotalDeltaCellType>
  |};
  declare type TextCellType = {|
    type: 'text',
    text: string
  |};

  declare type DeltaCellType = {|
    type: 'delta',
    size: number,
    sizePercent: number,
    gzipSize: number,
    gzipSizePercent: number,
    hashChanged: boolean
  |};

  declare type TotalCellType = {|
    type: 'total',
    size: number,
    gzipSize: number
  |};

  declare type TotalDeltaCellType = {|
    type: 'totalDelta',
    size: number,
    sizePercent: number,
    gzipSize: number,
    gzipSizePercent: number
  |};

  declare type RevisionCellType = {|
    type: 'revision',
    revision: string
  |};

  declare type RevisionDeltaCellType = {|
    type: 'revisionDelta',
    revision: string,
    deltaIndex: number,
    againstRevision: string
  |};

  declare type ArtifactCellType = {|
    type: 'artifact',
    text: string
  |};

  declare type BodyCellType = ArtifactCellType | DeltaCellType | TotalCellType;
  declare type HeaderCellType = TextCellType | RevisionCellType | RevisionDeltaCellType;

  declare type ComparisonMatrix = {
    header: Array<HeaderCellType>,
    total: Array<BodyCellType>,
    body: Array<Array<BodyCellType>>
  };
}
