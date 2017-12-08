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
    stat: number,
    gzip: number
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
    stat: number,
    statPercent: number,
    gzip: number,
    gzipPercent: number,
    hashChanged: boolean
  |};

  declare type TotalCellType = {|
    type: 'total',
    stat: number,
    gzip: number
  |};

  declare type TotalDeltaCellType = {|
    type: 'totalDelta',
    stat: number,
    statPercent: number,
    gzip: number,
    gzipPercent: number
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

  /**
   * Application
   */

  declare type Thresholds = {|
    stat?: number,
    statPercent?: number,
    gzip?: number,
    gzipPercent?: number
  |};

  declare type ArtifactFilters = Array<RegExp>;

  declare type AppConfig = {|
    artifactFilters?: ArtifactFilters,
    thresholds?: Thresholds
  |};
}
