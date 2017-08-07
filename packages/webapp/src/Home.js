// @flow
import AreaChart from './charts/AreaChart';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { bundles, stats, statsForBundle } from './stats';

export default class Home extends Component {
  props: {
    match: Object
  };

  render() {
    const { params: { bundleName } } = this.props.match || { params: {} };
    const chartBundles = bundleName ? [bundleName] : bundles;
    const chartStats = bundleName ? statsForBundle(bundleName) : stats;
    return (
      <View style={styles.root}>
        <View style={styles.title}>
          {bundleName || 'All'}
        </View>
        <View style={styles.chart}>
          <AreaChart bundles={chartBundles} stats={chartStats} />
        </View>
        <View style={styles.meta}>Meta</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    height: '100vh'
  },
  title: {},
  chart: {
    flexGrow: 1
  },
  meta: {}
});
