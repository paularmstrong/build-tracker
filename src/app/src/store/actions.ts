/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import ColorScale from '../modules/ColorScale';
import {
  AddComparedRevision,
  AddSnack,
  ClearComparedRevision,
  RemoveComparedRevision,
  RemoveSnack,
  SetArtifactsActiveAction,
  SetBuildsAction,
  SetColorScaleAction,
  SetDateRange,
  SetDisabledArtifactsVisible,
  SetFocusedRevision,
  SetHoveredArtifacts,
  SetSizeKey
} from './types';

export const setArtifactActive = (artifacts: Array<string>, active: boolean): SetArtifactsActiveAction => ({
  type: 'ARTIFACT_SET_ACTIVE',
  meta: artifacts,
  payload: active
});

export const setBuilds = (builds: Array<Build>): SetBuildsAction => ({ type: 'BUILDS_SET', payload: builds });

export const setColorScale = (scale: keyof typeof ColorScale): SetColorScaleAction => ({
  type: 'COLOR_SCALE_SET',
  payload: scale
});

export const addComparedRevision = (revision: string): AddComparedRevision => ({
  type: 'COMPARED_REVISION_ADD',
  payload: revision
});

export const removeComparedRevision = (revision: string): RemoveComparedRevision => ({
  type: 'COMPARED_REVISION_REMOVE',
  payload: revision
});

export const clearComparedRevisions = (): ClearComparedRevision => ({
  type: 'COMPARED_REVISION_CLEAR',
  payload: null
});

export const setDisabledArtifactsVisible = (visible: boolean): SetDisabledArtifactsVisible => ({
  type: 'SET_DISABLED_ARTIFACTS',
  payload: visible
});

export const setFocusedRevision = (revision?: string): SetFocusedRevision => ({
  type: 'SET_FOCUSED_REVISION',
  payload: revision
});

export const addSnack = (message: string): AddSnack => ({
  type: 'ADD_SNACK',
  payload: message
});

export const removeSnack = (message: string): RemoveSnack => ({
  type: 'REMOVE_SNACK',
  payload: message
});

export const setHoveredArtifacts = (artifactNames: Array<string>): SetHoveredArtifacts => ({
  type: 'HOVER_ARTIFACTS',
  payload: artifactNames
});

export const setSizeKey = (key: string): SetSizeKey => ({ type: 'SET_SIZE_KEY', payload: key });

export const setDateRange = (start: Date, end: Date): SetDateRange => ({
  type: 'SET_DATE_RANGE',
  payload: { start, end }
});
