/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import { fetch } from 'cross-fetch';
import { RouteComponentProps } from 'react-router';
import { FetchState, State } from '../../store/types';
import React, { FunctionComponent } from 'react';
import { setBuilds, setFetchState } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';

const DEFAULT_LIMIT = '30';

const Latest: FunctionComponent<RouteComponentProps<{ limit?: string }>> = (props): React.ReactElement => {
  const { limit = DEFAULT_LIMIT } = props.match.params;
  const url = useSelector((state: State) => state.url);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setFetchState(FetchState.FETCHING));
    fetch(`${url}/api/builds/${limit}`)
      .then((response) => response.json())
      .then((builds) => {
        if (!Array.isArray(builds)) {
          throw new Error('Bad response');
        }
        dispatch(setBuilds(builds.map((buildStruct) => new Build(buildStruct.meta, buildStruct.artifacts))));
        dispatch(setFetchState(FetchState.FETCHED));
      })
      .catch(() => {
        dispatch(setFetchState(FetchState.ERROR));
      });
  }, [dispatch, limit, url]);
  return null;
};

export default Latest;
