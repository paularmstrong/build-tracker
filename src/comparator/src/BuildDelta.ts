/**
 * Copyright (c) 2019 Paul Armstrong
 */
import ArtifactDelta from './ArtifactDelta';
import { ArtifactBudgets, ArtifactFilters, Group } from '@build-tracker/types';
import Build, { ArtifactSizes, BuildMeta } from '@build-tracker/build';

const emptyObject = Object.freeze({});

export interface DeltaOptions {
  artifactBudgets?: ArtifactBudgets;
  artifactFilters?: ArtifactFilters;
  groups?: Array<Group>;
}

export default class BuildDelta<M extends BuildMeta = BuildMeta, A extends ArtifactSizes = ArtifactSizes> {
  private _baseBuild: Build<M, A>;
  private _prevBuild: Build<M, A>;

  private _artifactBudgets: ArtifactBudgets;
  private _artifactDeltas: Map<string, ArtifactDelta<A>>;
  private _artifactFilters: ArtifactFilters;
  private _artifactNames: Set<string>;
  private _groups: Array<Group>;
  private _groupDeltas: Map<string, ArtifactDelta<A>>;
  private _sizeKeys: Set<string>;

  public constructor(baseBuild: Build<M, A>, prevBuild: Build<M, A>, options: DeltaOptions = {}) {
    this._baseBuild = baseBuild;
    this._prevBuild = prevBuild;
    this._artifactBudgets = options.artifactBudgets || emptyObject;
    this._artifactFilters = options.artifactFilters || [];
    this._groups = options.groups || [];
  }

  public get baseBuild(): Build<M, A> {
    return this._baseBuild;
  }

  public get prevBuild(): Build<M, A> {
    return this._prevBuild;
  }

  public get artifactSizes(): Array<string> {
    if (!this._sizeKeys) {
      this._sizeKeys = new Set();
      this._baseBuild.artifactSizes.forEach(key => {
        this._sizeKeys.add(key);
      });
      this._prevBuild.artifactSizes.forEach(key => {
        this._sizeKeys.add(key);
      });
      if (
        this._sizeKeys.size !== this._baseBuild.artifactSizes.length ||
        this._sizeKeys.size !== this._prevBuild.artifactSizes.length
      ) {
        throw new Error('Size keys do not match between builds');
      }
    }

    return Array.from(this._sizeKeys);
  }

  public getArtifactDelta(name: string): ArtifactDelta {
    if (!this._artifactDeltas) {
      this.artifactDeltas;
    }
    if (!this._artifactDeltas.has(name)) {
      // @ts-ignore
      const noSize: A = this.artifactSizes.reduce((memo, key) => {
        memo[key] = 0;
        return memo;
      }, {});
      return new ArtifactDelta<A>(name, [], noSize, noSize, false);
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

  private get _fauxArtifactSizes(): A {
    // @ts-ignore
    return this.artifactSizes.reduce((memo, sizeKey) => {
      memo[sizeKey] = 0;
      return memo;
    }, {});
  }

  public get artifactDeltas(): Array<ArtifactDelta<A>> {
    if (!this._artifactDeltas) {
      this._artifactDeltas = new Map();
      this.artifactNames.forEach(artifactName => {
        const baseArtifact = this._baseBuild.getArtifact(artifactName);
        const prevArtifact = this._prevBuild.getArtifact(artifactName);

        const sizes = baseArtifact ? baseArtifact.sizes : this._fauxArtifactSizes;
        const prevSizes = prevArtifact ? prevArtifact.sizes : this._fauxArtifactSizes;

        const delta = new ArtifactDelta<A>(
          artifactName,
          this._artifactBudgets[artifactName] || [],
          sizes,
          prevSizes,
          !baseArtifact || !prevArtifact || baseArtifact.hash !== prevArtifact.hash
        );

        this._artifactDeltas.set(artifactName, delta);
      });
    }

    return Array.from(this._artifactDeltas.values());
  }

  public getGroupDelta(groupName: string): ArtifactDelta<A> {
    if (!this._groupDeltas) {
      this.groupDeltas;
    }
    return this._groupDeltas.get(groupName);
  }

  public get groupDeltas(): Map<string, ArtifactDelta<A>> {
    if (!this._groupDeltas) {
      this._groupDeltas = new Map();
      this._groups.forEach(group => {
        let artifactNames = group.artifactNames ? [...group.artifactNames] : [];
        if (group.artifactMatch) {
          artifactNames = artifactNames.concat(
            Array.from(this.artifactNames).filter(name => group.artifactMatch.test(name))
          );
        }

        const baseSum = this._baseBuild.getSum(artifactNames);
        const prevSum = this._prevBuild.getSum(artifactNames);

        const hashChanged = artifactNames.reduce((changed, artifactName) => {
          const baseArtifact = this._baseBuild.getArtifact(artifactName);
          const prevArtifact = this._prevBuild.getArtifact(artifactName);
          return changed ? true : !baseArtifact || !prevArtifact || baseArtifact.hash !== prevArtifact.hash;
        }, false);

        const delta = new ArtifactDelta<A>(
          group.name,
          group.budgets || [],
          baseSum || this._fauxArtifactSizes,
          prevSum || this._fauxArtifactSizes,
          hashChanged
        );

        this._groupDeltas.set(group.name, delta);
      });
    }

    return this._groupDeltas;
  }
}
