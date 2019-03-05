/**
 * Copyright (c) 2019 Paul Armstrong
 */
export type ArtifactFilters = Array<RegExp>;

export interface Budget {
  level: 'warn' | 'error';
  sizeKey: string;
  type: 'delta' | 'percentDelta' | 'size';
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
    budgets: ArtifactBudgets;
    filters: ArtifactFilters;
  };
  groups?: Array<Group>;
  root: string;
  routing?: 'hash' | 'history';
}
