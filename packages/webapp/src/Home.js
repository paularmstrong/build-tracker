// @flow
import { bytesToKb } from './formatting';
import AreaChart from './charts/AreaChart';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { stats, statsForBundle } from './stats';
import { XScaleType, YScaleType } from './values';

export default class Home extends Component {
  props: {
    bundles: Array<string>,
    colorScale: Function,
    match: Object,
    onPickCommit: Function,
    valueAccessor: Function,
    yScaleType: $Values<typeof YScaleType>,
    xScaleType: $Values<typeof XScaleType>
  };

  state: {
    commit?: Object
  };

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {};
  }

  render() {
    const { params: { bundleName } } = this.props.match || { params: {} };
    const { bundles, colorScale, valueAccessor, xScaleType, yScaleType } = this.props;
    const { commit } = this.state;
    const chartBundles = bundleName ? [bundleName] : bundles;
    const chartStats = bundleName ? statsForBundle(bundleName) : stats;
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={styles.title}>
            {bundleName || 'All'}
          </View>
        </View>
        <View style={styles.chart}>
          <AreaChart
            allBundles={bundles}
            bundles={chartBundles}
            colorScale={colorScale}
            onHover={this._handleHover}
            valueAccessor={valueAccessor}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            stats={chartStats}
          />
        </View>
        <View style={styles.meta}>
          Meta
          <table>
            <tbody>
              {commit
                ? Object.entries(commit.build).map(([key, value]) =>
                    <tr key={key}>
                      <th>
                        {key}
                      </th>
                      <td>
                        {value}
                      </td>
                    </tr>
                  )
                : null}
              <tr>
                <th>Stat Size</th>
                <td>
                  {commit
                    ? bytesToKb(
                        Object.values(commit.stats).reduce(
                          (memo, bundle) => memo + (bundle && bundle.size ? parseInt(bundle.size, 10) : 0),
                          0
                        )
                      )
                    : null}
                </td>
              </tr>
              <tr>
                <th>Gzip Size</th>
                <td>
                  {commit
                    ? bytesToKb(
                        Object.values(commit.stats).reduce(
                          (memo, bundle) => memo + (bundle && bundle.gzipSize ? parseInt(bundle.gzipSize, 10) : 0),
                          0
                        )
                      )
                    : null}
                </td>
              </tr>
            </tbody>
          </table>
        </View>
      </View>
    );
  }

  _handleHover = (commit: Object, bundleName: string) => {
    this.setState({ commit });
    this.props.onPickCommit && this.props.onPickCommit(commit, bundleName);
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
  chart: {
    flexGrow: 1
  },
  meta: {
    minHeight: '20vh'
  }
});
