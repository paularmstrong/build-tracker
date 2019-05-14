/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Actions from '../actions';
import Build from '@build-tracker/build';
import ColorScale from '../../modules/ColorScale';
import Comparator from '@build-tracker/comparator';
import reducer from '../reducer';
import { State } from '../types';

const initialState: State = Object.freeze({
  activeArtifacts: {},
  activeComparator: null,
  artifactConfig: {},
  builds: [],
  colorScale: Object.keys(ColorScale)[0],
  comparator: new Comparator({ builds: [] }),
  comparedRevisions: [],
  dateRange: undefined,
  disabledArtifactsVisible: true,
  hoveredArtifacts: [],
  snacks: [],
  sizeKey: '',
  url: 'https://build-tracker.local'
});

const buildA = new Build({ branch: 'master', revision: '123', parentRevision: '000', timestamp: Date.now() - 400 }, [
  { name: 'tacos', hash: '123', sizes: { stat: 123, gzip: 45 } }
]);
const buildB = new Build({ branch: 'master', revision: 'abc', parentRevision: '123', timestamp: Date.now() }, [
  { name: 'tacos', hash: 'abc', sizes: { stat: 125, gzip: 47 } }
]);

describe('reducer', () => {
  describe('active artifacts', () => {
    test('updates the active state of artifacts', () => {
      const state = reducer(
        { ...initialState, activeArtifacts: { churros: false } },
        Actions.setArtifactActive(['tacos', 'burritos'], true)
      );
      expect(state.activeArtifacts).toEqual({ churros: false, tacos: true, burritos: true });
    });
  });

  describe('set builds', () => {
    test('stores builds', () => {
      const state = reducer(initialState, Actions.setBuilds([buildA, buildB]));
      expect(state.builds).toEqual([buildA, buildB]);
    });

    test('sets a new comparator with the given builds', () => {
      const state = reducer(initialState, Actions.setBuilds([buildA, buildB]));
      expect(state.comparator).toBeInstanceOf(Comparator);
      expect(state.comparator.artifactNames).toEqual(['tacos']);
    });

    test('activates all artifacts', () => {
      const state = reducer(initialState, Actions.setBuilds([buildA, buildB]));
      expect(state.activeArtifacts).toEqual({ tacos: true });
    });
  });

  describe('set color scale', () => {
    test('sets the color scale', () => {
      const state = reducer(initialState, Actions.setColorScale('Cool'));
      expect(state.colorScale).toEqual('Cool');
    });
  });

  describe('compared revisions', () => {
    test('adding updates the active comparator', () => {
      const state = reducer({ ...initialState, builds: [buildA, buildB] }, Actions.addComparedRevision('123'));
      expect(state.comparedRevisions).toEqual(['123']);
      expect(state.activeComparator.builds.map(b => b.getMetaValue('revision'))).toEqual(['123']);
    });

    test('removing updates the active comparator', () => {
      const state = reducer(
        { ...initialState, activeComparator: new Comparator({ builds: [buildA] }), builds: [buildA, buildB] },
        Actions.removeComparedRevision('123')
      );
      expect(state.comparedRevisions).toEqual([]);
      expect(state.activeComparator.builds).toEqual([]);
    });

    test('removing unfocuses the build if it is focused', () => {
      const state = reducer(
        {
          ...initialState,
          activeComparator: new Comparator({ builds: [buildA] }),
          builds: [buildA, buildB],
          comparedRevisions: ['123'],
          focusedRevision: '123'
        },
        Actions.removeComparedRevision('123')
      );
      expect(state.focusedRevision).toBeUndefined();
    });

    test('clearing clears all', () => {
      const state = reducer(
        {
          ...initialState,
          activeComparator: new Comparator({ builds: [buildA, buildB] }),
          builds: [buildA, buildB],
          comparedRevisions: ['123', 'abc'],
          focusedRevision: '123'
        },
        Actions.clearComparedRevisions()
      );
      expect(state.focusedRevision).toBeUndefined();
      expect(state.comparedRevisions).toEqual([]);
      expect(state.activeComparator).toBeNull();
    });
  });

  describe('set focused revision', () => {
    test('sets the revision', () => {
      const state = reducer(initialState, Actions.setFocusedRevision('123'));
      expect(state.focusedRevision).toBe('123');
    });

    test('can clear', () => {
      const state = reducer(initialState, Actions.setFocusedRevision());
      expect(state.focusedRevision).toBeUndefined();
    });
  });

  describe('disabled artifacts visibility', () => {
    test('can be toggled', () => {
      const state = reducer(
        { ...initialState, disabledArtifactsVisible: true },
        Actions.setDisabledArtifactsVisible(false)
      );
      expect(state.disabledArtifactsVisible).toBe(false);
    });
  });

  describe('set size key', () => {
    test('sets the size key', () => {
      const state = reducer({ ...initialState, sizeKey: 'tacos' }, Actions.setSizeKey('burritos'));
      expect(state.sizeKey).toBe('burritos');
    });
  });

  describe('snacks', () => {
    test('can be added', () => {
      const state = reducer({ ...initialState, snacks: ['tacos'] }, Actions.addSnack('burritos'));
      expect(state.snacks).toEqual(['tacos', 'burritos']);
    });

    test('can be removed', () => {
      const state = reducer(
        { ...initialState, snacks: ['tacos', 'churros', 'burritos'] },
        Actions.removeSnack('churros')
      );
      expect(state.snacks).toEqual(['tacos', 'burritos']);
    });
  });

  describe('hovered artifacts', () => {
    test('can be set', () => {
      const state = reducer(initialState, Actions.setHoveredArtifacts(['burritos', 'tacos']));
      expect(state.hoveredArtifacts).toEqual(['burritos', 'tacos']);
    });

    test('does not modify state if new hovered are equal', () => {
      const mockState = { ...initialState, hoveredArtifacts: ['tacos', 'burritos'] };
      const state = reducer(mockState, Actions.setHoveredArtifacts(['burritos', 'tacos']));
      expect(state).toBe(mockState);
    });
  });

  describe('date range', () => {
    test('sets the date range', () => {
      const start = new Date(2018);
      const end = new Date(2019);
      const state = reducer(initialState, Actions.setDateRange(start, end));
      expect(state.dateRange).toEqual({ start, end });
    });

    test('clears the comparedRevisions', () => {
      const state = reducer(
        { ...initialState, comparedRevisions: ['123', '456', '789'] },
        Actions.setDateRange(new Date(2017), new Date(2019))
      );
      expect(state.comparedRevisions).toHaveLength(0);
    });
  });

  describe('unknown actions', () => {
    test('returns the state', () => {
      // @ts-ignore
      expect(reducer(initialState, {})).toEqual(initialState);
    });
  });
});
