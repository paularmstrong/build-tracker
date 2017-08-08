// @flow
import AreaChart, { XScaleType, YScaleType } from './charts/AreaChart';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { bundles, stats, statsForBundle } from './stats';

export default class Home extends Component {
  props: {
    match: Object,
    onPickDate: Function
  };

  state: {
    date?: Object,
    xScaleType: string,
    yScaleType: string
  };

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = { xScaleType: 'commit', yScaleType: 'linear' };
  }

  render() {
    const { params: { bundleName } } = this.props.match || { params: {} };
    const { date, xScaleType, yScaleType } = this.state;
    const chartBundles = bundleName ? [bundleName] : bundles;
    const chartStats = bundleName ? statsForBundle(bundleName) : stats;
    const commitByTimestamp = chartStats.find(commit => commit.build.timestamp === date) || { build: {}, stats: {} };
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={styles.title}>
            {bundleName || 'All'}
          </View>
          <View style={styles.scaleTypeButtons}>
            {Object.values(YScaleType).map(scale =>
              <View key={scale} style={styles.scaleTypeButton}>
                <button value={scale} onClick={this._handleYScaleChange}>
                  {scale}
                </button>
              </View>
            )}
            {Object.values(XScaleType).map(scale =>
              <View key={scale} style={styles.scaleTypeButton}>
                <button value={scale} onClick={this._handleXScaleChange}>
                  {scale}
                </button>
              </View>
            )}
          </View>
        </View>
        <View style={styles.chart}>
          <AreaChart
            bundles={chartBundles}
            onHover={this._handleHover}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            stats={chartStats}
          />
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

  _handleYScaleChange = (event: { target: { value: string } }) => {
    const { target: { value: yScaleType } } = event;
    this.setState({ yScaleType });
  };

  _handleXScaleChange = (event: { target: { value: string } }) => {
    const { target: { value: xScaleType } } = event;
    this.setState({ xScaleType });
  };
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    height: '100vh'
  },
  header: {
    flexDirection: 'row'
  },
  title: {
    flexGrow: 1
  },
  scaleTypeButtons: {
    flexDirection: 'row'
  },
  scaleTypeButton: {
    flexGrow: 1
  },
  chart: {
    flexGrow: 1
  },
  meta: {
    minHeight: '20vh'
  }
});
