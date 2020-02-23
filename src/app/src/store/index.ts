/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import ColorScale from '../modules/ColorScale';
import Comparator from '@build-tracker/comparator';
import reducer from './reducer';
import { Actions, FetchState, GraphType, State } from './types';
import { createStore, Store } from 'redux';

export default function makeStore(initialState: Partial<State> = {}): Store<State, Actions> {
  const store = createStore(reducer, {
    activeArtifacts: {},
    activeComparator: null,
    artifactConfig: {},
    budgets: [],
    builds: [],
    colorScale: Object.keys(ColorScale)[0],
    comparator: new Comparator({ builds: [] }),
    comparedRevisions: [],
    disabledArtifactsVisible: true,
    fetchState: FetchState.NONE,
    graphType: GraphType.AREA,
    hideAttribution: false,
    hoveredArtifacts: [],
    name: 'Build Tracker',
    snacks: [],
    sizeKey: '',
    ...initialState
  });
  if (process.env.NODE_ENV !== 'production' && canUseDOM && !window.hasOwnProperty('redux')) {
    Object.defineProperty(window, 'redux', {
      writable: false,
      value: store
    });
  }
  return store;
}
