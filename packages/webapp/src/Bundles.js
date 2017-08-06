import { defaultStyles } from './theme';
import SparkLine from './charts/SparkLine';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { View } from 'react-native';
import { getBundles } from './stats';

export default class Bundles extends Component {
  render() {
    const bundles = getBundles();
    return (
      <View>
        {bundles.map(bundle =>
          <Link key={bundle} style={defaultStyles.link} to={`/bundles/${bundle}`}>
            {bundle}
            <SparkLine />
          </Link>
        )}
      </View>
    );
  }
}
