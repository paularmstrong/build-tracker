// @flow
import AreaChart, { ScaleType } from './charts/AreaChart';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { bundles, stats, statsForBundle } from './stats';

export default class Home extends Component {
  props: {
    match: Object,
    onPickDate: Function
  };

  state: {
    date?: Object,
    scaleType: string
  };

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = { scaleType: 'linear' };
  }

  render() {
    const { params: { bundleName } } = this.props.match || { params: {} };
    const { date, scaleType } = this.state;
    const chartBundles = bundleName ? [bundleName] : bundles;
    const chartStats = bundleName ? statsForBundle(bundleName) : stats;
    const commitByTimestamp = chartStats.find(commit => commit.build.timestamp === date) || { build: {}, stats: {} };
    return (
      <View style={styles.root}>
        <View style={styles.title}>
          {bundleName || 'All'}
        </View>
        <View>
          {Object.values(ScaleType).map(scale =>
            <button key={scale} value={scale} onClick={this._handleScaleChange}>
              {scale}
            </button>
          )}
        </View>
        <View style={styles.chart}>
          <AreaChart bundles={chartBundles} onHover={this._handleHover} scaleType={scaleType} stats={chartStats} />
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
                    (memo, bundle) => memo + (bundle && bundle.size ? parseInt(bundle.size, 10) : 0),
                    0
                  )}
                </td>
              </tr>
              <tr>
                <th>Gzip Size</th>
                <td>
                  {Object.values(commitByTimestamp.stats).reduce(
                    (memo, bundle) => memo + (bundle && bundle.gzipSize ? parseInt(bundle.gzipSize, 10) : 0),
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

  _handleHover = (date: Object) => {
    this.setState({ date });
    this.props.onPickDate && this.props.onPickDate(date);
  };

  _handleScaleChange = (event: { target: { value: string } }) => {
    const { target: { value: scaleType } } = event;
    this.setState({ scaleType });
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
