/**
 * Copyright (c) 2019 Paul Armstrong
 */
export type ArtifactFilters = Array<RegExp>;

export interface Budget {
  /**
   * Budget callout level
   * warn - inform that this change could be problematic
   * error - this change violates the budget and should not be accepted
   */
  level: 'warn' | 'error';
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
  type: 'delta' | 'percentDelta' | 'size';
  /**
   * Maximum value for the type defined above
   * @type {number}
   */
  maximum: number;
}

export interface Group {
  artifactNames: Array<string>;
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
