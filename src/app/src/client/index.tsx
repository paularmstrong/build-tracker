/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppRegistry } from 'react-native';
import Main from '../screens/Main';
import makeStore from '../store';
import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from 'redux-react-hook';

// @ts-ignore
const initialProps = window.__PROPS__ || {};
const store = makeStore(initialProps);

const App = (): React.ReactElement => (
  <StoreContext.Provider value={store}>
    <Main />
  </StoreContext.Provider>
);

AppRegistry.registerComponent('App', () => App);
// @ts-ignore
const { element } = AppRegistry.getApplication('App', {});
ReactDOM.hydrate(element, document.getElementById('root'));
