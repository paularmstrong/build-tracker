import AreaChart from './charts/AreaChart';
import React, { Component } from 'react';
import { View } from 'react-native';

export default class Home extends Component {
  render() {
    return (
      <View style={{ height: '100%' }}>
        Home
        <AreaChart />
      </View>
    );
  }
}
