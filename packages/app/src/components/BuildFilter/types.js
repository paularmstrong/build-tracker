// @flow
import type { BT$ArtifactFilters } from '@build-tracker/types';

export type Filters = {|
  artifactFilters: BT$ArtifactFilters,
  artifactsFiltered: boolean,
  startDate: Date,
  endDate: Date
|};
