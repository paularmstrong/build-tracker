// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, HashRouter, Route } from 'react-router-dom';

const Router = window.location.pathname.endsWith('.html') ? HashRouter : BrowserRouter;

ReactDOM.render(
  <Router>
    <div>
      <Route path="/:artifactNames?/:compareRevisions?" component={App} />
    </div>
  </Router>,
  document.getElementById('root')
);
