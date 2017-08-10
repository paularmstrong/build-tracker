// @flow
import { bytesToKb } from './formatting';
import AreaChart from './charts/AreaChart';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { statsForBundles } from './stats';
import { XScaleType, YScaleType } from './values';

export default class Home extends Component {
  props: {
    activeBundles: Array<string>,
    bundles: Array<string>,
    colorScale: Function,
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
    const { activeBundles, bundles, colorScale, valueAccessor, xScaleType, yScaleType } = this.props;
    const { commit } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.chart}>
          <AreaChart
            activeBundles={activeBundles}
            bundles={bundles}
            colorScale={colorScale}
            onHover={this._handleHover}
            valueAccessor={valueAccessor}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            stats={statsForBundles(bundles)}
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
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    left: 0
  },
  chart: {
    flex: 2
  },
  meta: {
    minHeight: '20vh'
  }
});
