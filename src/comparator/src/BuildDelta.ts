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

export default class BuildDelta<M extends BuildMeta = BuildMeta> {
  #baseBuild: Build<M>;
  #prevBuild: Build<M>;

  #artifactBudgets: ArtifactBudgets;
  #artifactDeltas: Map<string, ArtifactDelta>;
  #artifactFilters: ArtifactFilters;
  #artifactNames: Set<string>;
  #groups: Array<Group>;
  #groupDeltas: Map<string, ArtifactDelta>;
  #sizeKeys: Set<string>;

  constructor(baseBuild: Build<M>, prevBuild: Build<M>, options: DeltaOptions = {}) {
    this.#baseBuild = baseBuild;
    this.#prevBuild = prevBuild;
    this.#artifactBudgets = options.artifactBudgets || emptyObject;
    this.#artifactFilters = options.artifactFilters || [];
    this.#groups = options.groups || [];
  }

  get baseBuild(): Build<M> {
    return this.#baseBuild;
  }

  get prevBuild(): Build<M> {
    return this.#prevBuild;
  }

  get artifactSizes(): Array<string> {
    if (!this.#sizeKeys) {
      this.#sizeKeys = new Set();
      this.#baseBuild.artifactSizes.forEach((key) => {
        this.#sizeKeys.add(key);
      });
      this.#prevBuild.artifactSizes.forEach((key) => {
        this.#sizeKeys.add(key);
      });
      if (
        this.#sizeKeys.size !== this.#baseBuild.artifactSizes.length ||
        this.#sizeKeys.size !== this.#prevBuild.artifactSizes.length
      ) {
        throw new Error('Size keys do not match between builds');
      }
    }

    return Array.from(this.#sizeKeys);
  }

  getArtifactDelta(name: string): ArtifactDelta {
    if (!this.#artifactDeltas) {
      this.artifactDeltas;
    }
    if (!this.#artifactDeltas.has(name)) {
      // @ts-ignore
      const noSize: A = this.artifactSizes.reduce((memo, key) => {
        memo[key] = 0;
        return memo;
      }, {});
      return new ArtifactDelta(name, [], noSize, noSize, false);
    }
    return this.#artifactDeltas.get(name);
  }

  get artifactNames(): Set<string> {
    if (!this.#artifactNames) {
      this.#artifactNames = new Set();
      const mapNames = (name): void => {
        if (!this.#artifactFilters.some((filter) => filter.test(name))) {
          this.#artifactNames.add(name);
        }
      };
      this.#baseBuild.artifactNames.forEach(mapNames);
      this.#prevBuild.artifactNames.forEach(mapNames);
    }
    return this.#artifactNames;
  }

  get #fauxArtifactSizes(): ArtifactSizes {
    // @ts-ignore
    return this.artifactSizes.reduce((memo, sizeKey) => {
      memo[sizeKey] = 0;
      return memo;
    }, {});
  }

  get artifactDeltas(): Array<ArtifactDelta> {
    if (!this.#artifactDeltas) {
      this.#artifactDeltas = new Map();
      this.artifactNames.forEach((artifactName) => {
        const baseArtifact = this.#baseBuild.getArtifact(artifactName);
        const prevArtifact = this.#prevBuild.getArtifact(artifactName);

        const sizes = baseArtifact ? baseArtifact.sizes : this.#fauxArtifactSizes;
        const prevSizes = prevArtifact ? prevArtifact.sizes : this.#fauxArtifactSizes;
        const budgets = [...(this.#artifactBudgets[artifactName] || []), ...(this.#artifactBudgets['*'] || [])];

        const delta = new ArtifactDelta(
          artifactName,
          budgets,
          sizes,
          prevSizes,
          !baseArtifact || !prevArtifact || baseArtifact.hash !== prevArtifact.hash
        );

        this.#artifactDeltas.set(artifactName, delta);
      });
    }

    return Array.from(this.#artifactDeltas.values());
  }

  getGroupDelta(groupName: string): ArtifactDelta {
    if (!this.#groupDeltas) {
      this.groupDeltas;
    }
    return this.#groupDeltas.get(groupName);
  }

  get groupDeltas(): Map<string, ArtifactDelta> {
    if (!this.#groupDeltas) {
      this.#groupDeltas = new Map();
      this.#groups.forEach((group) => {
        let artifactNames = group.artifactNames ? [...group.artifactNames] : [];
        if (group.artifactMatch) {
          artifactNames = artifactNames.concat(
            Array.from(this.artifactNames).filter((name) => group.artifactMatch.test(name))
          );
        }

        const baseSum = this.#baseBuild.getSum(artifactNames);
        const prevSum = this.#prevBuild.getSum(artifactNames);

        const hashChanged = artifactNames.reduce((changed, artifactName) => {
          const baseArtifact = this.#baseBuild.getArtifact(artifactName);
          const prevArtifact = this.#prevBuild.getArtifact(artifactName);
          return changed ? true : !baseArtifact || !prevArtifact || baseArtifact.hash !== prevArtifact.hash;
        }, false);

        const delta = new ArtifactDelta(
          group.name,
          group.budgets || [],
          baseSum || this.#fauxArtifactSizes,
          prevSum || this.#fauxArtifactSizes,
          hashChanged
        );

        this.#groupDeltas.set(group.name, delta);
      });
    }

    return this.#groupDeltas;
  }
}
