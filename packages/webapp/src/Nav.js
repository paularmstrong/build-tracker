import Bundles from './Bundles';
import { Link, Route } from 'react-router-dom';
import React, { Component } from 'react';
import { View } from 'react-native';

export default class Nav extends Component {
  render() {
    return (
      <View>
        <Route exact path="/bundles/:bundle">
          <Link to="/">View All</Link>
        </Route>
        <Bundles />
      </View>
    );
  }
}
