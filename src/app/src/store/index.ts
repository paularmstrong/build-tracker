/**
 * Copyright (c) 2019 Paul Armstrong
 */
import ColorScale from '../modules/ColorScale';
import Comparator from '@build-tracker/comparator';
import reducer from './reducer';
import { Actions, State } from './types';
import { createStore, Store } from 'redux';

export default function makeStore(initialState: Partial<State> = {}): Store<State, Actions> {
  return createStore(reducer, {
    activeArtifacts: {},
    activeComparator: null,
    artifactConfig: {},
    builds: [],
    colorScale: Object.keys(ColorScale)[0],
    comparator: new Comparator({ builds: [] }),
    comparedRevisions: [],
    disabledArtifactsVisible: true,
    hoveredArtifacts: [],
    snacks: [],
    sizeKey: '',
    ...initialState
  });
}
