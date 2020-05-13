/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ArtifactSizes } from '@build-tracker/build';
import { Budget, BudgetResult } from '@build-tracker/types';
import { delta, percentDelta } from './artifact-math';

export default class ArtifactDelta {
  #name: string;
  #budgets: Array<Budget>;
  #results: Array<BudgetResult>;
  #sizes: ArtifactSizes;
  #prevSizes: ArtifactSizes;
  #hashChanged: boolean;

  constructor(
    name: string,
    budgets: Array<Budget>,
    sizes: ArtifactSizes,
    prevSizes: ArtifactSizes,
    hashChanged: boolean
  ) {
    this.#name = name;
    this.#budgets = budgets;
    this.#sizes = sizes;
    this.#prevSizes = prevSizes;
    this.#hashChanged = hashChanged;
  }

  get name(): string {
    return this.#name;
  }

  get sizes(): ArtifactSizes {
    return Object.keys(this.#sizes).reduce(
      (memo, sizeKey) => {
        // @ts-ignore
        memo[sizeKey] = delta(sizeKey, this.#sizes, this.#prevSizes);
        return memo;
      },
      { ...this.#sizes }
    );
  }

  get percents(): ArtifactSizes {
    return Object.keys(this.#sizes).reduce(
      (memo, sizeKey) => {
        // @ts-ignore
        memo[sizeKey] = percentDelta(sizeKey, this.#sizes, this.#prevSizes);
        return memo;
      },
      { ...this.#sizes }
    );
  }

  get hashChanged(): boolean {
    return this.#hashChanged;
  }

  get hashChangeUnexpected(): boolean {
    return (
      this.#hashChanged &&
      this.failingBudgets.length === 0 &&
      Object.keys(this.sizes).every((sizeKey) => this.sizes[sizeKey] === 0)
    );
  }

  get budgets(): Array<BudgetResult> {
    if (!this.#results) {
      const sizes = this.sizes;
      const percents = this.percents;

      this.#results = [];
      this.#budgets.forEach((budget) => {
        const { level, maximum, sizeKey, type } = budget;
        const actual =
          type === 'delta'
            ? sizes[sizeKey]
            : type === 'percentDelta'
            ? percents[sizeKey]
            : this.#sizes
            ? this.#sizes[sizeKey]
            : 0;
        const expected = maximum;
        this.#results.push({
          actual,
          expected,
          level,
          passing: actual < expected,
          sizeKey,
          type,
        });
      });
    }
    return this.#results;
  }

  get failingBudgets(): Array<BudgetResult> {
    return this.budgets.filter((budget) => budget.passing === false);
  }

  toObject(): {} {
    return {
      name: this.name,
      sizes: this.sizes,
      percents: this.percents,
      hashChanged: this.hashChanged,
      hashChangeUnexpected: this.hashChangeUnexpected,
      budgets: this.budgets,
      failingBudgets: this.failingBudgets,
    };
  }
}
