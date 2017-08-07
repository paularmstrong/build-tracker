import AreaChart from './charts/AreaChart';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { bundles, stats } from './stats';

export default class Home extends Component {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.title}>Home</View>
        <View style={styles.chart}>
          <AreaChart bundles={bundles} stats={stats} />
        </View>
        <View style={styles.meta}>Meta</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    height: '100%'
  },
  title: {
    flexGrow: 0
  },
  chart: {
    flexGrow: 1
  },
  meta: {
    flexGrow: 1,
    flexShrink: 1
  }
});
