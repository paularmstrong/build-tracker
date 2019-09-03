/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppRegistry } from 'react-native';
import history from './history';
import Main from '../screens/Main';
import makeStore from '../store';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import Routes from './Routes';

// @ts-ignore
const initialProps = window.__PROPS__ || {};
const params = new URLSearchParams(window.location.search.replace(/^\?/, ''));
const objParams = {
  activeArtifacts: params
    .getAll('activeArtifacts')
    .reduce((memo, artifactName) => ({ ...memo, [artifactName]: true }), {}),
  sizeKey: params.get('sizeKey'),
  disabledArtifactsVisible: params.get('disabledArtifactsVisible') === 'false' ? false : true,
  comparedRevisions: params.getAll('comparedRevisions') || []
};

const store = makeStore({ ...initialProps, ...objParams });

const App = (): React.ReactElement => (
  <Provider store={store}>
    <Router history={history}>
      <Routes />
      <Main />
    </Router>
  </Provider>
);

AppRegistry.registerComponent('App', () => App);
// @ts-ignore
const { element } = AppRegistry.getApplication('App', {});
ReactDOM.hydrate(element, document.getElementById('root'));
