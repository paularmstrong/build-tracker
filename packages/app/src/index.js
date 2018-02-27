// @flow
import App from './App';
import ContextProvider from './ContextProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';

const Router = window.location.pathname.endsWith('.html') ? HashRouter : BrowserRouter;

const getRoot = (): Element => {
  const rootNode = document.getElementById('root');
  return rootNode instanceof Element ? rootNode : document.createElement('div');
};

ReactDOM.render(
  <ContextProvider config={window.CONFIG || {}}>
    <Router>
      <Switch>
        <Route component={App} path="/revisions/:revisions/:artifactNames?/:compareRevisions?" />
        <Route component={App} path="/:artifactNames?/:compareRevisions?" />
      </Switch>
    </Router>
  </ContextProvider>,
  getRoot()
);
