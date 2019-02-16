import { ArtifactFilters } from '@build-tracker/types';
import Build, { ArtifactSizes, BuildMeta } from '@build-tracker/build';
import { delta, percentDelta } from './artifact-math';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface ArtifactDelta {
  hashChanged: boolean;
  name: string;
  sizes: ArtifactSizes;
}

interface BuildSizeDelta {
  againstRevision: BuildMeta['revision'];
  sizes: ArtifactSizes;
}

export default class BuildDelta {
  private _baseBuild: Build;
  private _prevBuild: Build;
  private _meta: BuildMeta;
  private _artifactDeltas: Map<string, ArtifactDelta>;
  private _artifactFilters: ArtifactFilters;
  private _artifactNames: Set<string>;
  private _totalDelta: BuildSizeDelta;

  public constructor(baseBuild: Build, prevBuild: Build, artifactFilters?: ArtifactFilters) {
    this._meta = Object.freeze(baseBuild.meta);
    this._baseBuild = baseBuild;
    this._prevBuild = prevBuild;
    this._artifactFilters = artifactFilters || [];
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

  public getArtifactDelta(name: string): ArtifactDelta {
    if (!this._artifactDeltas) {
      this.artifactDeltas;
    }
    return this._artifactDeltas.get(name);
  }

  public get artifactNames(): Set<string> {
    if (!this._artifactNames) {
      this._artifactNames = new Set();
      const mapNames = (name): void => {
        if (!this._artifactFilters.some(filter => filter.test(name))) {
          this._artifactNames.add(name);
        }
      };
      this._baseBuild.artifactNames.forEach(mapNames);
      this._prevBuild.artifactNames.forEach(mapNames);
    }
    return this._artifactNames;
  }

  public get artifactDeltas(): Array<ArtifactDelta> {
    if (!this._artifactDeltas) {
      this._artifactDeltas = new Map();
      this.artifactNames.forEach(artifactName => {
        const baseArtifact = this._baseBuild.getArtifact(artifactName);
        const prevArtifact = this._prevBuild.getArtifact(artifactName);
        const sizeDeltas = prevArtifact
          ? Object.keys(prevArtifact.sizes).reduce((memo, sizeKey) => {
              memo[sizeKey] = delta(sizeKey, baseArtifact && baseArtifact.sizes, prevArtifact && prevArtifact.sizes);
              memo[`${sizeKey}Percent`] = percentDelta(
                sizeKey,
                baseArtifact && baseArtifact.sizes,
                prevArtifact && prevArtifact.sizes
              );
              return memo;
            }, {})
          : { ...baseArtifact.sizes };
        this._artifactDeltas.set(artifactName, {
          name: artifactName,
          hashChanged: !baseArtifact || !prevArtifact || baseArtifact.hash !== prevArtifact.hash,
          sizes: sizeDeltas
        });
      });
    }

    return Array.from(this._artifactDeltas.values());
  }

  public get totalDelta(): BuildSizeDelta {
    if (!this._totalDelta) {
      const baseTotals = this._baseBuild.getTotals(this._artifactFilters);
      const prevTotals = this._prevBuild.getTotals(this._artifactFilters);
      this._totalDelta = {
        againstRevision: this._prevBuild.getMetaValue('revision'),
        sizes: Object.keys(baseTotals).reduce((memo, sizeKey) => {
          memo[sizeKey] = delta(sizeKey, baseTotals, prevTotals);
          memo[`${sizeKey}Percent`] = percentDelta(sizeKey, baseTotals, prevTotals);
          return memo;
        }, {})
      };
    }

    return this._totalDelta;
  }
}
