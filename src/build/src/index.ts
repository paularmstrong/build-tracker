import { ArtifactFilters } from '@build-tracker/types';
export type BuildMetaItem = string | { value: string; url: string };

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface BuildMeta {
  branch?: BuildMetaItem;
  revision: BuildMetaItem;
  timestamp: number;
}

export interface Artifact {
  hash: string;
  name: string;
  sizes: ArtifactSizes;
}

export interface ArtifactSizes {
  [key: string]: number;
}

export default class Build {
  private _meta: BuildMeta;
  private _artifacts: Map<string, Artifact>;
  private _totals: ArtifactSizes;

  public constructor(meta, artifacts: Array<Artifact>) {
    this._meta = Object.freeze(meta);
    this._artifacts = new Map();
    artifacts.forEach(artifact => {
      this._artifacts.set(artifact.name, artifact);
    });
  }

  public get meta(): BuildMeta {
    return this._meta;
  }

  public get timestamp(): Date {
    return new Date(this._meta.timestamp);
  }

  public getMetaValue(key: keyof Omit<BuildMeta, 'timestamp'>): string {
    const val = this._meta[key];
    return typeof val === 'object' ? val.value : val;
  }

  public get artifacts(): Array<Artifact> {
    return Array.from(this._artifacts.values());
  }

  public getArtifact(name: string): Artifact {
    return this._artifacts.get(name);
  }

  public get artifactNames(): Array<string> {
    return Array.from(this._artifacts.keys());
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
            const size = this._artifacts.get(artifactName).sizes[key] || 0;
            totals[key] = value - size;
          });
        }
      });
      return totals;
    }

    return this._totals;
  }
}
