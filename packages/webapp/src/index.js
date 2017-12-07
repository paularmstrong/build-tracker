// @flow
import ContextProvider from './ContextProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
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
        <Route path="/revisions/:revisions/:artifactNames?/:compareRevisions?" component={App} />
        <Route path="/:artifactNames?/:compareRevisions?" component={App} />
      </Switch>
    </Router>
  </ContextProvider>,
  getRoot()
);
