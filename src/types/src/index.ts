/**
 * Copyright (c) 2019 Paul Armstrong
 */
export type ArtifactFilters = Array<RegExp>;

export enum BudgetLevel {
  WARN = 'warn',
  ERROR = 'error'
}

export enum BudgetType {
  DELTA = 'delta',
  PERCENT_DELTA = 'percentDelta',
  SIZE = 'size'
}

export interface Budget {
  /**
   * Budget callout level
   * warn - inform that this change could be problematic
   * error - this change violates the budget and should not be accepted
   */
  level: BudgetLevel;
  /**
   * Type of file size to operate on. Usually 'gzip' or 'stat1'
   * @type {string}
   */
  sizeKey: string;
  /**
   * Type of change to moniro
   * delta - maximum allowed for new value minus previous value
   * percentDelta - maximum allowed for the percent change from the previous value to the new value
   * size - absolute maximum value
   */
  type: BudgetType;
  /**
   * Maximum value for the type defined above
   * @type {number}
   */
  maximum: number;
}

export interface BudgetResult {
  sizeKey: string;
  passing: boolean;
  expected: number;
  actual: number;
  type: Budget['type'];
  level: Budget['level'];
}

export interface Group {
  artifactNames: Array<string>;
  artifactMatch?: RegExp;
  budgets?: Array<Budget>;
  name: string;
}

export interface ArtifactBudgets {
  [artifactName: string]: Array<Budget>;
}

export interface AppConfig {
  artifacts?: {
    budgets?: ArtifactBudgets;
    filters?: ArtifactFilters;
    groups?: Array<Group>;
  };
  /**
   * Budgets for the sum of all artifacts
   * @type {Array<Budget>}
   */
  budgets?: Array<Budget>;
}
