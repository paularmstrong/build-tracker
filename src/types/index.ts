/**
 * Copyright (c) 2019 Paul Armstrong
 */
export interface SizeBudget {
  delta?: number;
  percent?: number;
}

export interface Budget {
  warn?: {
    [key: string]: SizeBudget;
  };
  error?: {
    [key: string]: SizeBudget;
  };
  good?: {
    [key: string]: SizeBudget;
  };
}

export interface Group {
  artifactNames: Array<string>;
  budget?: Budget;
  name: string;
}

export interface ArtifactBudget {
  budget: Budget;
  name: string;
}

export type ArtifactFilters = Array<RegExp>;

export interface AppConfig {
  artifacts?: {
    budgets: Array<ArtifactBudget>;
    filters: ArtifactFilters;
  };
  budgets?: Budget;
  groups?: Array<Group>;
  root: string;
  routing?: 'hash' | 'history';
}
