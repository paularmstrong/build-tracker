import Bundles from './Bundles';
import { defaultStyles } from './theme';
import { Link, Route } from 'react-router-dom';
import React, { Component } from 'react';
import { View } from 'react-native';

export default class Nav extends Component {
  render() {
    return (
      <View>
        <Route exact path="/bundles/:bundle">
          <Link style={defaultStyles.link} to="/">
            View All
          </Link>
        </Route>
        <Bundles />
      </View>
    );
  }
}
