/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Builds from './routes/Builds';
import Dates from './routes/Dates';
import Latest from './routes/Latest';
import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router';

const Routes: FunctionComponent<{}> = (): React.ReactElement => {
  return (
    <Switch>
      <Route exact path="/" component={Latest} />
      <Route exact path="/builds/dates/:startTimestamp..:endTimestamp" component={Dates} />
      <Route exact path="/builds/limit/:limit" component={Latest} />
      <Route exact path="/builds/:revisions+" component={Builds} />
    </Switch>
  );
};

export default Routes;
