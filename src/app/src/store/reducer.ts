/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Comparator from '@build-tracker/comparator';
import { Actions, State } from './types';

const getActiveComparator = (
  comparedRevisions: State['comparedRevisions'],
  builds: State['builds'],
  artifactConfig: State['artifactConfig']
): Comparator => {
  return new Comparator({
    artifactBudgets: artifactConfig.budgets,
    builds: builds.filter(build => comparedRevisions.includes(build.getMetaValue('revision'))),
    groups: artifactConfig.groups
  });
};

export default function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'ARTIFACT_SET_ACTIVE': {
      const activeArtifacts = action.meta.reduce(
        (memo, artifactName) => {
          memo[artifactName] = action.payload;
          return memo;
        },
        { ...state.activeArtifacts }
      );
      return { ...state, activeArtifacts };
    }

    case 'BUILDS_SET': {
      const builds = action.payload;
      const comparator = new Comparator({ builds });
      const activeArtifacts = comparator.artifactNames.reduce((memo, artifactName) => {
        memo[artifactName] = true;
        return memo;
      }, {});
      return { ...state, activeArtifacts, builds, comparator, sizeKey: comparator.sizeKeys[0] };
    }

    case 'COLOR_SCALE_SET':
      return { ...state, colorScale: action.payload };

    case 'COMPARED_REVISION_ADD': {
      const comparedRevisions = [...state.comparedRevisions, action.payload];
      return {
        ...state,
        activeComparator: getActiveComparator(comparedRevisions, state.builds, state.artifactConfig),
        comparedRevisions
      };
    }

    case 'COMPARED_REVISION_REMOVE': {
      const comparedRevisions = state.comparedRevisions.filter(rev => rev !== action.payload);
      return {
        ...state,
        activeComparator: getActiveComparator(comparedRevisions, state.builds, state.artifactConfig),
        comparedRevisions,
        focusedRevision: state.focusedRevision === action.payload ? undefined : state.focusedRevision
      };
    }

    case 'COMPARED_REVISION_CLEAR':
      return { ...state, activeComparator: null, comparedRevisions: [], focusedRevision: undefined };

    case 'SET_FOCUSED_REVISION':
      return { ...state, focusedRevision: action.payload || undefined };

    case 'SET_DISABLED_ARTIFACTS':
      return { ...state, disabledArtifactsVisible: action.payload };

    case 'SET_SIZE_KEY':
      return { ...state, sizeKey: action.payload };

    case 'ADD_SNACK':
      return { ...state, snacks: [...state.snacks, action.payload] };

    case 'REMOVE_SNACK':
      return { ...state, snacks: state.snacks.filter(msg => msg !== action.payload) };

    case 'HOVER_ARTIFACTS':
      if (
        state.hoveredArtifacts.length === action.payload.length &&
        action.payload.every(value => state.hoveredArtifacts.includes(value))
      ) {
        return state;
      }
      return { ...state, hoveredArtifacts: action.payload };

    case 'SET_DATE_RANGE':
      return { ...state, comparedRevisions: [], dateRange: action.payload };

    default:
      return state;
  }
}
