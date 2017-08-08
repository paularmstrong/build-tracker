// @flow
import AreaChart from './charts/AreaChart';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { bundles, stats, statsForBundle } from './stats';

export default class Home extends Component {
  props: {
    match: Object,
    onPickDate: Function
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
    const commitByTimestamp = chartStats.find(commit => commit.build.timestamp === date) || { build: {}, stats: {} };
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
              {Object.entries(commitByTimestamp.build).map(([key, value]) =>
                <tr key={key}>
                  <th>
                    {key}
                  </th>
                  <td>
                    {value}
                  </td>
                </tr>
              )}
              <tr>
                <th>Stat Size</th>
                <td>
                  {Object.values(commitByTimestamp.stats).reduce(
                    (memo, bundle) => memo + (bundle ? bundle.size : 0),
                    0
                  )}
                </td>
              </tr>
              <tr>
                <th>Gzip Size</th>
                <td>
                  {Object.values(commitByTimestamp.stats).reduce(
                    (memo, bundle) => memo + (bundle ? bundle.gzipSize : 0),
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </View>
      </View>
    );
  }

  _handleHover = date => {
    this.setState({ date });
    this.props.onPickDate && this.props.onPickDate(date);
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
