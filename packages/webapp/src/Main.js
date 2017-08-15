// @flow
import Chart from './charts/Chart';
import deepEqual from 'deep-equal';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { statsForBundles } from './stats';
import { ChartType, XScaleType, YScaleType } from './values';
import type { Build } from './types.js';

export default class Main extends Component {
  props: {
    activeBundles: Array<string>,
    builds: Array<Build>,
    bundles: Array<string>,
    chart: $Values<typeof ChartType>,
    colorScale: Function,
    onHoverBundle?: Function,
    onSelectBuild: Function,
    valueAccessor: Function,
    yScaleType: $Values<typeof YScaleType>,
    xScaleType: $Values<typeof XScaleType>
  };

  _stats: Array<Build>;

  constructor(props: Object, context: Object) {
    super(props, context);
    this._stats = statsForBundles(props.bundles);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (!deepEqual(this.props.bundles, nextProps.bundles)) {
      this._stats = statsForBundles(nextProps.bundles);
    }
  }

  render() {
    const {
      activeBundles,
      builds,
      bundles,
      chart,
      colorScale,
      onSelectBuild,
      valueAccessor,
      xScaleType,
      yScaleType
    } = this.props;
    return (
      <View style={styles.root}>
        <View style={styles.chart}>
          <Chart
            activeBundles={activeBundles}
            bundles={bundles}
            chartType={chart}
            colorScale={colorScale}
            onHover={this._handleHover}
            onSelectBuild={onSelectBuild}
            selectedBuilds={builds.map(b => b.meta.revision)}
            valueAccessor={valueAccessor}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            stats={this._stats}
          />
        </View>
      </View>
    );
  }

  _handleHover = (bundle?: Object) => {
    const { onHoverBundle } = this.props;
    onHoverBundle && onHoverBundle(bundle && bundle.key);
  };
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    minHeight: '100%',
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
