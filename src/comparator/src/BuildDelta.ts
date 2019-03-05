/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ArtifactBudgets, ArtifactFilters, Budget, Group } from '@build-tracker/types';
import Build, { ArtifactSizes, BuildMeta } from '@build-tracker/build';
import { delta, percentDelta } from './artifact-math';

const emptyObject = Object.freeze({});

interface BudgetResult {
  passing: boolean;
  expected: number;
  actual: number;
  type: Budget['type'];
  level: Budget['level'];
}

interface ArtifactDelta<AS extends ArtifactSizes = ArtifactSizes> {
  hashChanged: boolean;
  name: string;
  sizes: AS;
  percents: AS;
  budget: { [sizeKey: string]: BudgetResult };
}

interface BuildSizeDelta<M extends BuildMeta = BuildMeta, AS extends ArtifactSizes = ArtifactSizes> {
  againstRevision: M['revision'];
  sizes: AS;
  percents: AS;
}

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
  private _sizeKeys: Set<string>;
  private _totalDelta: BuildSizeDelta<M, A>;

  public constructor(baseBuild: Build<M, A>, prevBuild: Build<M, A>, options: DeltaOptions) {
    this._baseBuild = baseBuild;
    this._prevBuild = prevBuild;
    this._artifactBudgets = options.artifactBudgets || emptyObject;
    this._artifactFilters = options.artifactFilters || [];
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

  public get artifactDeltas(): Array<ArtifactDelta<A>> {
    if (!this._artifactDeltas) {
      this._artifactDeltas = new Map();
      this.artifactNames.forEach(artifactName => {
        const baseArtifact = this._baseBuild.getArtifact(artifactName);
        const prevArtifact = this._prevBuild.getArtifact(artifactName);

        const sizeDeltas = prevArtifact
          ? this.artifactSizes.reduce((memo, sizeKey) => {
              memo[sizeKey] = delta(sizeKey, baseArtifact && baseArtifact.sizes, prevArtifact && prevArtifact.sizes);
              return memo;
            }, {})
          : { ...baseArtifact.sizes };

        const percentDeltas = this.artifactSizes.reduce((memo, sizeKey) => {
          memo[sizeKey] = percentDelta(sizeKey, baseArtifact && baseArtifact.sizes, prevArtifact && prevArtifact.sizes);
          return memo;
        }, {});

        let budgets = [];
        (this._artifactBudgets[artifactName] || []).forEach(budget => {
          const { level, maximum, sizeKey, type } = budget;
          const actual =
            type === 'delta'
              ? sizeDeltas[sizeKey]
              : type === 'percentDelta'
              ? percentDeltas[sizeKey]
              : baseArtifact
              ? baseArtifact.sizes[sizeKey]
              : 0;
          const expected = maximum;
          budgets.push({
            passing: actual < expected,
            type,
            level,
            actual,
            expected
          });
        });

        this._artifactDeltas.set(artifactName, {
          name: artifactName,
          budgets,
          hashChanged: !baseArtifact || !prevArtifact || baseArtifact.hash !== prevArtifact.hash,
          // @ts-ignore constructed above
          sizes: sizeDeltas,
          // @ts-ignore constructed above
          percents: percentDeltas
        });
      });
    }

    return Array.from(this._artifactDeltas.values());
  }

  public get totalDelta(): BuildSizeDelta<M, A> {
    if (!this._totalDelta) {
      const baseTotals = this._baseBuild.getTotals(this._artifactFilters);
      const prevTotals = this._prevBuild.getTotals(this._artifactFilters);

      const sizes = {};
      const percents = {};
      Object.keys(baseTotals).forEach(sizeKey => {
        sizes[sizeKey] = delta(sizeKey, baseTotals, prevTotals);
        percents[sizeKey] = percentDelta(sizeKey, baseTotals, prevTotals);
      });

      this._totalDelta = {
        // @ts-ignore TODO
        againstRevision: this._prevBuild.getMetaValue('revision'),
        // @ts-ignore constructed above
        sizes,
        // @ts-ignore constructed above
        percents
      };
    }

    return this._totalDelta;
  }
}
