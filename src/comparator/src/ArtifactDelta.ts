/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ArtifactSizes } from '@build-tracker/build';
import { Budget, BudgetResult } from '@build-tracker/types';
import { delta, percentDelta } from './artifact-math';

export default class ArtifactDelta<AS extends ArtifactSizes = ArtifactSizes> {
  private _name: string;
  private _budgets: Array<Budget>;
  private _results: Array<BudgetResult>;
  private _sizes: AS;
  private _prevSizes: AS;
  private _hashChanged: boolean;

  public constructor(name: string, budgets: Array<Budget>, sizes: AS, prevSizes: AS, hashChanged: boolean) {
    this._name = name;
    this._budgets = budgets;
    this._sizes = sizes;
    this._prevSizes = prevSizes;
    this._hashChanged = hashChanged;
  }

  public get name(): string {
    return this._name;
  }

  public get sizes(): AS {
    return Object.keys(this._sizes).reduce(
      (memo, sizeKey) => {
        memo[sizeKey] = delta(sizeKey, this._sizes, this._prevSizes);
        return memo;
      },
      { ...this._sizes }
    );
  }

  public get percents(): AS {
    return Object.keys(this._sizes).reduce(
      (memo, sizeKey) => {
        memo[sizeKey] = percentDelta(sizeKey, this._sizes, this._prevSizes);
        return memo;
      },
      { ...this._sizes }
    );
  }

  public get hashChanged(): boolean {
    return this._hashChanged;
  }

  public get budgets(): Array<BudgetResult> {
    if (!this._results) {
      const sizes = this.sizes;
      const percents = this.percents;

      this._results = [];
      this._budgets.forEach(budget => {
        const { level, maximum, sizeKey, type } = budget;
        const actual =
          type === 'delta'
            ? sizes[sizeKey]
            : type === 'percentDelta'
            ? percents[sizeKey]
            : this._sizes
            ? this._sizes[sizeKey]
            : 0;
        const expected = maximum;
        this._results.push({
          actual,
          expected,
          level,
          passing: actual < expected,
          sizeKey,
          type
        });
      });
    }
    return this._results;
  }

  public get failingBudgets(): Array<BudgetResult> {
    return this.budgets.filter(budget => budget.passing === false);
  }

  public toObject(): {} {
    return {
      name: this.name,
      sizes: this.sizes,
      percents: this.percents,
      hashChanged: this.hashChanged,
      budgets: this.budgets,
      failingBudgets: this.failingBudgets
    };
  }
}
