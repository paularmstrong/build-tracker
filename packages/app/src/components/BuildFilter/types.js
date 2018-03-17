// @flow
import type { BT$ArtifactFilters } from '@build-tracker/types';

export type Filters = {|
  artifactFilters: BT$ArtifactFilters,
  startDate: Date,
  endDate: Date
|};
