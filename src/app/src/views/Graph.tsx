/**
 * Copyright (c) 2019 Paul Armstrong
 */
import EmptyState from '../components/EmptyState';
import Graph from '../components/Graph';
import React from 'react';
import { State } from '../store/types';
import { useSelector } from 'react-redux';

const GraphView = (): React.ReactElement => {
  const comparator = useSelector((state: State) => state.comparator);

  if (comparator.builds.length) {
    return <Graph comparator={comparator} />;
  }

  return <EmptyState message="No builds found. Choose another range from the menu." />;
};

export default GraphView;
