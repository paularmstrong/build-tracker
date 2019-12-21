/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppConfig } from '@build-tracker/types';
import Build from '@build-tracker/build';
import ColorScale from '../modules/ColorScale';
import Comparator from '@build-tracker/comparator';

export enum FetchState {
  NONE,
  FETCHING,
  FETCHED,
  ERROR
}

export enum GraphType {
  AREA = 'AREA',
  STACKED_BAR = 'STACKED_BAR'
}

export interface State {
  activeArtifacts: { [key: string]: boolean };
  activeComparator: Comparator;
  artifactConfig: AppConfig['artifacts'];
  builds: Array<Build>;
  colorScale: keyof typeof ColorScale;
  comparator: Comparator;
  comparedRevisions: Array<string>;
  disabledArtifactsVisible: boolean;
  fetchState: FetchState;
  focusedRevision?: string;
  graphType: GraphType;
  hideAttribution: boolean;
  hoveredArtifacts: Array<string>;
  name: string;
  snacks: Array<string>;
  sizeKey: string;
  url: string;
}

interface Action<T, P, M = undefined> {
  type: T;
  payload: P;
  meta?: M;
}
export type SetArtifactsActiveAction = Action<'ARTIFACT_SET_ACTIVE', boolean, Array<string>>;
export type SetBuildsAction = Action<'BUILDS_SET', Array<Build>>;
export type SetColorScaleAction = Action<'COLOR_SCALE_SET', keyof typeof ColorScale>;
export type AddComparedRevision = Action<'COMPARED_REVISION_ADD', string>;
export type RemoveComparedRevision = Action<'COMPARED_REVISION_REMOVE', string>;
export type ClearComparedRevision = Action<'COMPARED_REVISION_CLEAR', void>;
export type SetDisabledArtifactsVisible = Action<'SET_DISABLED_ARTIFACTS', boolean>;
export type SetFocusedRevision = Action<'SET_FOCUSED_REVISION', string | void>;
export type SetSizeKey = Action<'SET_SIZE_KEY', string>;
export type AddSnack = Action<'ADD_SNACK', string>;
export type RemoveSnack = Action<'REMOVE_SNACK', string>;
export type SetHoveredArtifacts = Action<'HOVER_ARTIFACTS', Array<string>>;
export type SetFetchState = Action<'SET_FETCH_STATE', FetchState>;
export type SetGraphType = Action<'SET_GRAPH_TYPE', GraphType>;

export type Actions =
  | SetArtifactsActiveAction
  | SetBuildsAction
  | SetColorScaleAction
  | AddComparedRevision
  | RemoveComparedRevision
  | ClearComparedRevision
  | SetDisabledArtifactsVisible
  | SetFocusedRevision
  | SetSizeKey
  | AddSnack
  | RemoveSnack
  | SetHoveredArtifacts
  | SetFetchState
  | SetGraphType;
