/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppRegistry } from 'react-native';
import Main from '../screens/Main';
import makeStore from '../store';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

// @ts-ignore
const initialProps = window.__PROPS__ || {};
const store = makeStore(initialProps);

const App = (): React.ReactElement => (
  <Provider store={store}>
    <Main />
  </Provider>
);

AppRegistry.registerComponent('App', () => App);
// @ts-ignore
const { element } = AppRegistry.getApplication('App', {});
ReactDOM.hydrate(element, document.getElementById('root'));
