/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import { removeSnack } from '../store/actions';
import Snackbar from '../components/Snackbar';
import { State } from '../store/types';
import { useDispatch, useSelector } from 'react-redux';

const SnacksView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const message = useSelector((state: State) => state.snacks[0]);

  const portalRoot = canUseDOM && document.getElementById('snackbarPortal');

  React.useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(removeSnack(message));
      }, 4000);
    }
  }, [dispatch, message]);

  const bar = message ? <Snackbar text={message} /> : null;

  return portalRoot ? ReactDOM.createPortal(bar, portalRoot) : bar;
};

export default SnacksView;
