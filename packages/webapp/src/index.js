// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';

const Router = window.location.pathname.endsWith('.html') ? HashRouter : BrowserRouter;

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/revisions/:revisions/:artifactNames?/:compareRevisions?" component={App} />
      <Route path="/:artifactNames?/:compareRevisions?" component={App} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
