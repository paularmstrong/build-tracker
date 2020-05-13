/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ArtifactFilters } from '@build-tracker/types';
export type BuildMetaItem = string | { value: string; url: string };

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface BuildMeta {
  // Unique revision identifier. Usually a git SHA
  revision: BuildMetaItem;
  // Unique parent revision identifier. Usually a git SHA from `git merge-base $revision`.
  // This is used for default comparisons
  parentRevision: BuildMetaItem;
  // DateTime value representing when this build was created
  timestamp: number;
  // Branch name for this revision. Helps for in-progress work to be filtered from the default UI
  branch: BuildMetaItem;
}

export interface Artifact {
  // Unique hash of the contents of this artifact.
  hash: string;
  // Name of this build artifact
  name: string;
  // Computed sizes of the build artifact
  sizes: ArtifactSizes;
}

export interface ArtifactSizes {
  // Create your own size calculations, in bytes
  // `stat` and `gzip` sizes are most commonly used for web applications
  [key: string]: number;
}

export default class Build<M extends BuildMeta = BuildMeta> {
  #meta: M;
  #artifacts: Map<string, Artifact>;
  #totals: ArtifactSizes;
  #sizeKeys: Set<string>;

  constructor(meta: M, artifacts: Array<Artifact>) {
    this.#meta = Object.freeze(meta);
    this.#artifacts = new Map();
    artifacts.forEach((artifact) => {
      this.#artifacts.set(artifact.name, artifact);
    });
  }

  static fromJSON<M extends BuildMeta = BuildMeta>(build: { meta: M; artifacts: Array<Artifact> }): Build<M> {
    return new Build(build.meta, build.artifacts);
  }

  toJSON(): { meta: M; artifacts: Array<Artifact> } {
    return { meta: this.meta, artifacts: Array.from(this.#artifacts.values()) };
  }

  get meta(): M {
    return this.#meta;
  }

  get timestamp(): Date {
    return new Date(parseInt(`${this.#meta.timestamp}000`, 10));
  }

  getMetaValue(key: keyof Omit<M, 'timestamp'>): string {
    const val = this.#meta[key];
    // @ts-ignore
    return typeof val === 'object' && val.hasOwnProperty('value') ? val.value : val;
  }

  getMetaUrl(key: keyof Omit<M, 'timestamp'>): string | undefined {
    const val = this.#meta[key];
    // @ts-ignore
    return typeof val === 'object' && val.hasOwnProperty('url') ? val.url : undefined;
  }

  get artifacts(): Array<Artifact> {
    return Array.from(this.#artifacts.values());
  }

  get artifactSizes(): Array<string> {
    if (!this.#sizeKeys) {
      this.#sizeKeys = new Set();
      this.#artifacts.forEach((artifact) => {
        Object.keys(artifact.sizes).forEach((k) => {
          this.#sizeKeys.add(k);
        });
      });
    }
    return Array.from(this.#sizeKeys);
  }

  getArtifact(name: string): Artifact {
    return this.#artifacts.get(name);
  }

  get artifactNames(): Array<string> {
    return Array.from(this.#artifacts.keys());
  }

  getSum(artifactNames: Array<string>): ArtifactSizes {
    return artifactNames.reduce((sum: ArtifactSizes, artifactName: string) => {
      const artifact = this.#artifacts.get(artifactName);
      if (artifact) {
        Object.entries(artifact.sizes).forEach(([key, value]) => {
          if (!sum[key]) {
            sum[key] = 0;
          }
          sum[key] += value;
        });
      }
      return sum;
    }, {});
  }

  getTotals(artifactFilters?: ArtifactFilters): ArtifactSizes {
    if (!this.#totals) {
      this.#totals = {};
      this.#artifacts.forEach((artifact) => {
        Object.entries(artifact.sizes).forEach(([key, value]) => {
          if (!this.#totals[key]) {
            this.#totals[key] = 0;
          }
          this.#totals[key] += value;
        });
      });
    }

    if (artifactFilters && artifactFilters.length) {
      const totals = { ...this.#totals };
      Array.from(this.#artifacts.keys()).forEach((artifactName) => {
        if (artifactFilters.some((filter) => filter.test(artifactName))) {
          Object.entries(this.#totals).forEach(([key, value]) => {
            const size = this.#artifacts.get(artifactName).sizes[key];
            totals[key] = value - size;
          });
        }
      });
      return totals;
    }

    return this.#totals;
  }
}
