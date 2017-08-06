import AreaChart from './charts/AreaChart';
import React, { Component } from 'react';
import { View } from 'react-native';
import { bundles, stats } from './stats';

export default class Home extends Component {
  render() {
    return (
      <View style={{ height: '100%' }}>
        Home
        <AreaChart bundles={bundles} stats={stats} />
      </View>
    );
  }
}
