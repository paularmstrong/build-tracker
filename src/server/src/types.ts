/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Comparator from '@build-tracker/comparator';
import { Artifact, BuildMeta } from '@build-tracker/build';

export interface Build {
  meta: BuildMeta;
  artifacts: Array<Artifact<{}>>;
}

export interface Queries {
  build: {
    byRevision: (revision: string) => Promise<Build>;
    insert: (build: Build) => Promise<string>;
  };
  builds: {
    byRevisions: (...revisions: Array<string>) => Promise<Array<Build>>;
    byRevisionRange: (startRevision: string, endRevision: string) => Promise<Array<Build>>;
    byTimeRange: (startTimestamp: number, endTimestamp: number, branch: string) => Promise<Array<Build>>;
    recent: (limit: number, branch: string) => Promise<Array<Build>>;
  };
}

export interface Handlers {
  onBuildInsert?: (comparator: Comparator) => Promise<void>;
}
