/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppRegistry } from 'react-native';
import history from './history';
import Main from '../screens/Main';
import makeStore from '../store';
import { Provider } from 'react-redux';
import React from 'react';
import { Router } from 'react-router';
import Routes from './Routes';
import { searchParamsToStore } from '../store/utils';

// @ts-ignore
const initialProps = window.__PROPS__ || {};

const store = makeStore({ ...initialProps, ...searchParamsToStore(window.location.search) });

const App = (): React.ReactElement => (
  <Provider store={store}>
    <Router history={history}>
      <Routes />
      <Main />
    </Router>
  </Provider>
);

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  hydrate: true,
  initialProps: {},
  rootTag: document.getElementById('root')
});
