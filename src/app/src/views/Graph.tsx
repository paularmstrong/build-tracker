/**
 * Copyright (c) 2019 Paul Armstrong
 */
import EmptyState from '../components/EmptyState';
import Graph from '../components/Graph';
import React from 'react';
import { State } from '../store/types';
import { useMappedState } from 'redux-react-hook';

interface MappedState {
  comparator: State['comparator'];
}

const mapState = (state: State): MappedState => ({
  comparator: state.comparator
});

const GraphView = (): React.ReactElement => {
  const { comparator } = useMappedState(mapState);

  if (comparator.builds.length) {
    return <Graph comparator={comparator} />;
  }

  return <EmptyState message="No builds found. Choose another range from the menu." />;
};

export default GraphView;
