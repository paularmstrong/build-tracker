// @flow
import AreaChart from './charts/AreaChart';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { bundles, stats, statsForBundle } from './stats';

export default class Home extends Component {
  props: {
    match: Object
  };

  constructor(props, context) {
    super(props, context);
    this.state = { date: null };
  }

  render() {
    const { params: { bundleName } } = this.props.match || { params: {} };
    const { date } = this.state;
    const chartBundles = bundleName ? [bundleName] : bundles;
    const chartStats = bundleName ? statsForBundle(bundleName) : stats;
    const statsForMeta = chartStats.find(commit => commit.build.timestamp === date) || { build: {} };
    return (
      <View style={styles.root}>
        <View style={styles.title}>
          {bundleName || 'All'}
        </View>
        <View style={styles.chart}>
          <AreaChart bundles={chartBundles} onHover={this._handleHover} stats={chartStats} />
        </View>
        <View style={styles.meta}>
          Meta
          <table>
            <tbody>
              {Object.entries(statsForMeta.build).map(([key, value]) =>
                <tr key={key}>
                  <th>
                    {key}
                  </th>
                  <td>
                    {value}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </View>
      </View>
    );
  }

  _handleHover = date => {
    this.setState({ date });
  };
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
  meta: {
    minHeight: '20vh'
  }
});
