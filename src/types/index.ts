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

/**
 * Application
 */

export interface Thresholds {
  [key: string]: number;
}

export type ArtifactFilters = Array<RegExp>;

export interface AppConfig {
  artifactFilters?: ArtifactFilters;
  root: string;
  routing?: 'hash' | 'history';
  thresholds?: Thresholds;
  toggleGroups?: { [key: string]: Array<string> };
}
