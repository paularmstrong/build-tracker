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
  private _meta: M;
  private _artifacts: Map<string, Artifact>;
  private _totals: ArtifactSizes;
  private _sizeKeys: Set<string>;

  public constructor(meta: M, artifacts: Array<Artifact>) {
    this._meta = Object.freeze(meta);
    this._artifacts = new Map();
    artifacts.forEach(artifact => {
      this._artifacts.set(artifact.name, artifact);
    });
  }

  public static fromJSON<M extends BuildMeta = BuildMeta>(build: { meta: M; artifacts: Array<Artifact> }): Build<M> {
    return new Build(build.meta, build.artifacts);
  }

  public toJSON(): { meta: M; artifacts: Array<Artifact> } {
    return { meta: this.meta, artifacts: Array.from(this._artifacts.values()) };
  }

  public get meta(): M {
    return this._meta;
  }

  public get timestamp(): Date {
    return new Date(parseInt(`${this._meta.timestamp}000`, 10));
  }

  public getMetaValue(key: keyof Omit<M, 'timestamp'>): string {
    const val = this._meta[key];
    // @ts-ignore
    return typeof val === 'object' && val.hasOwnProperty('value') ? val.value : val;
  }

  public getMetaUrl(key: keyof Omit<M, 'timestamp'>): string | undefined {
    const val = this._meta[key];
    // @ts-ignore
    return typeof val === 'object' && val.hasOwnProperty('url') ? val.url : undefined;
  }

  public get artifacts(): Array<Artifact> {
    return Array.from(this._artifacts.values());
  }

  public get artifactSizes(): Array<string> {
    if (!this._sizeKeys) {
      this._sizeKeys = new Set();
      this._artifacts.forEach(artifact => {
        Object.keys(artifact.sizes).forEach(k => {
          this._sizeKeys.add(k);
        });
      });
    }
    return Array.from(this._sizeKeys);
  }

  public getArtifact(name: string): Artifact {
    return this._artifacts.get(name);
  }

  public get artifactNames(): Array<string> {
    return Array.from(this._artifacts.keys());
  }

  public getSum(artifactNames: Array<string>): ArtifactSizes {
    return artifactNames.reduce((sum: ArtifactSizes, artifactName: string) => {
      const artifact = this._artifacts.get(artifactName);
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

  public getTotals(artifactFilters?: ArtifactFilters): ArtifactSizes {
    if (!this._totals) {
      this._totals = {};
      this._artifacts.forEach(artifact => {
        Object.entries(artifact.sizes).forEach(([key, value]) => {
          if (!this._totals[key]) {
            this._totals[key] = 0;
          }
          this._totals[key] += value;
        });
      });
    }

    if (artifactFilters && artifactFilters.length) {
      const totals = { ...this._totals };
      Array.from(this._artifacts.keys()).forEach(artifactName => {
        if (artifactFilters.some(filter => filter.test(artifactName))) {
          Object.entries(this._totals).forEach(([key, value]) => {
            const size = this._artifacts.get(artifactName).sizes[key];
            totals[key] = value - size;
          });
        }
      });
      return totals;
    }

    return this._totals;
  }
}
