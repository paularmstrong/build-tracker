// @flow
import App from './App';
import type { BT$AppConfig } from '@build-tracker/types';
import ContextProvider from './ContextProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';

const getRoot = (): Element => {
  const rootNode = document.getElementById('root');
  return rootNode instanceof Element ? rootNode : document.createElement('div');
};

const config: BT$AppConfig = window.CONFIG || {
  root: '/',
  routing: 'history',
  toggleGroups: {
    // boot: ['main', 'vendor', 'shared', 'runtime', 'bundle.HomeTimeline']
  }
};

const Router = config.routing === 'hash' ? HashRouter : BrowserRouter;

ReactDOM.render(
  <ContextProvider config={config}>
    <Router basename={config.root}>
      <Switch>
        <Route component={App} path="/revisions/:revisions/:artifactNames?/:compareRevisions?" />
        <Route component={App} path="/:artifactNames?/:compareRevisions?" />
      </Switch>
    </Router>
  </ContextProvider>,
  getRoot()
);
