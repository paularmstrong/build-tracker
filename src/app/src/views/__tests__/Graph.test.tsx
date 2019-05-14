/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import EmptyState from '../../components/EmptyState';
import Graph from '../Graph';
import mockStore from '../../store/mock';
import React from 'react';
import { render } from 'react-native-testing-library';
import { StoreContext } from 'redux-react-hook';

const build = new Build({ branch: 'master', revision: '1234565', parentRevision: 'abcdef', timestamp: 123 }, []);

describe('Graph', () => {
  test('renders an empty message if no builds in comparator', () => {
    const { queryAllByType } = render(
      <StoreContext.Provider value={mockStore({ comparator: new Comparator({ builds: [] }) })}>
        <Graph />
      </StoreContext.Provider>
    );
    expect(queryAllByType(EmptyState)).toHaveLength(1);
  });

  test('does not render an empty message if there are builds in comparator', () => {
    const { queryAllByType } = render(
      <StoreContext.Provider
        value={mockStore({ activeArtifacts: {}, colorScale: 'Magma', comparator: new Comparator({ builds: [build] }) })}
      >
        <Graph />
      </StoreContext.Provider>
    );
    expect(queryAllByType(EmptyState)).toHaveLength(0);
  });
});
