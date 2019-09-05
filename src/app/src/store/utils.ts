/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { GraphType, State } from './types';

export const searchParamsToStore = (params: string): Partial<State> => {
  const searchParams = new URLSearchParams(params.replace(/^\?/, ''));
  const state: Partial<State> = {};

  const activeArtifacts = searchParams.getAll('activeArtifacts');

  if (activeArtifacts.length) {
    state.activeArtifacts = activeArtifacts.reduce((memo, artifactName) => ({ ...memo, [artifactName]: true }), {});
  }

  const graphType: GraphType = GraphType[searchParams.get('graphType')];
  if (graphType in GraphType) {
    state.graphType = graphType;
  }

  const sizeKey = searchParams.get('sizeKey');
  if (sizeKey) {
    state.sizeKey = sizeKey;
  }

  const disabledArtifactsVisible =
    searchParams.get('disabledArtifactsVisible') === 'false'
      ? false
      : searchParams.get('disabledArtifactsVisible') === 'true'
      ? true
      : undefined;
  if (typeof disabledArtifactsVisible === 'boolean') {
    state.disabledArtifactsVisible = disabledArtifactsVisible;
  }

  const comparedRevisions = searchParams.getAll('comparedRevisions');
  if (comparedRevisions.length) {
    state.comparedRevisions = comparedRevisions;
  }

  return state;
};
