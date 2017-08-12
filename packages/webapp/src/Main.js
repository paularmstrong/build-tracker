// @flow
import AreaChart from './charts/AreaChart';
import Comparisons from './Comparisons';
import deepEqual from 'deep-equal';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { statsForBundles } from './stats';
import { XScaleType, YScaleType } from './values';

export default class Main extends Component {
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
    builds: Array<Object>
  };

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      builds: []
    };
    this._stats = statsForBundles(props.bundles);
  }

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(this.props, nextProps)) {
      this._stats = statsForBundles(nextProps.bundles);
    }
  }

  render() {
    const { activeBundles, bundles, colorScale, valueAccessor, xScaleType, yScaleType } = this.props;
    const { builds } = this.state;
    const sortedBuilds = builds.sort((a, b) => a.build.timestamp - b.build.timestamp);
    return (
      <View style={styles.root}>
        <View style={styles.chart}>
          <AreaChart
            activeBundles={activeBundles}
            bundles={bundles}
            colorScale={colorScale}
            onSelectBuild={this._handleSelectBuild}
            selectedBuilds={builds.map(b => b.build.revision)}
            valueAccessor={valueAccessor}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            stats={this._stats}
          />
        </View>
        <View style={styles.meta}>
          <Comparisons
            builds={sortedBuilds}
            bundles={bundles}
            colorScale={colorScale}
            onClickRemove={this._handleRemoveRevision}
            valueAccessor={valueAccessor}
          />
        </View>
      </View>
    );
  }

  _handleSelectBuild = (build: Object, bundleName: string) => {
    this.setState({ builds: [...this.state.builds, build] });
  };

  _handleRemoveBuild = (build: Object) => {
    this.setState(() => this.state.builds.filter(thisBuild => thisBuild.build.revision !== build.build.revision));
  };

  _handleRemoveRevision = (revision: string) => {
    this.setState(() => ({ builds: this.state.builds.filter(build => build.build.revision !== revision) }));
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
