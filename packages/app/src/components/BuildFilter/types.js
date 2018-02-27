// @flow
export type BranchFilters = { baseBranch: string, compareBranch: string };
export type DateFilters = { startDate: Date, endDate: Date };
export type Filters = BranchFilters & DateFilters;
