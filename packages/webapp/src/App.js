// @flow
import BuildInfo from './BuildInfo';
import Comparisons from './Comparisons';
import deepEqual from 'deep-equal';
import Main from './Main';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from './theme';
import Toggles from './Toggles';
import { bundlesBySize } from './stats';
import { interpolateRainbow, scaleSequential } from 'd3-scale';
import { ValueType, valueTypeAccessor, XScaleType, YScaleType } from './values';

import type { Match, RouterHistory } from 'react-router-dom';
import type { Build } from './types';

const colorScale = scaleSequential(interpolateRainbow).domain([0, bundlesBySize.length]);

const _getActiveBundles = (props: Object): Array<string> => {
  const { match: { params } } = props;
  const { bundleNames } = params;
  if (!bundleNames) {
    return bundlesBySize;
  } else {
    const bundles = bundleNames.split('+');
    return bundlesBySize.filter(b => bundles.indexOf(b) !== -1);
  }
};

class App extends Component {
  state: {
    builds: Array<Build>,
    highlightBundle?: string,
    selectedBuild?: Build,
    values: $Values<typeof ValueType>,
    xscale: $Values<typeof XScaleType>,
    yscale: $Values<typeof YScaleType>
  };

  props: {
    history: RouterHistory,
    match: Match
  };

  _activeBundles: Array<string>;

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      builds: [],
      values: ValueType.GZIP,
      xscale: XScaleType.COMMIT,
      yscale: YScaleType.LINEAR
    };
    this._activeBundles = _getActiveBundles(props);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (!deepEqual(this.props.match.params, nextProps.match.params)) {
      this._activeBundles = _getActiveBundles(nextProps);
    }
  }

  render() {
    const { builds, highlightBundle, selectedBuild, values, xscale, yscale } = this.state;
    const sortedBuilds = builds.sort((a, b) => a.build.timestamp - b.build.timestamp);
    return (
      <View style={styles.root}>
        <View style={styles.main}>
          <View style={styles.scaleTypeButtons}>
            <Toggles
              onToggle={this._handleToggleValueTypes}
              valueType={values}
              xScaleType={xscale}
              yScaleType={yscale}
            />
          </View>
          <View style={styles.innerMain}>
            <Main
              activeBundles={this._activeBundles}
              builds={sortedBuilds}
              bundles={bundlesBySize}
              colorScale={colorScale}
              onHoverBundle={this._handleHoverBundle}
              onSelectBuild={this._handleSelectBuild}
              valueAccessor={valueTypeAccessor[values]}
              xScaleType={xscale}
              yScaleType={yscale}
            />
          </View>
        </View>
        <View style={styles.data}>
          <View style={styles.table}>
            <Comparisons
              activeBundles={this._activeBundles}
              builds={sortedBuilds}
              bundles={bundlesBySize}
              colorScale={colorScale}
              highlightBundle={highlightBundle}
              onBundlesChange={this._handleBundlesChange}
              onRemoveBuild={this._handleRemoveRevision}
              onShowBuildInfo={this._handleShowBuildInfo}
              valueAccessor={valueTypeAccessor[values]}
            />
          </View>
          <View style={styles.info}>
            {selectedBuild ? <BuildInfo build={selectedBuild} /> : null}
          </View>
        </View>
      </View>
    );
  }

  _handleToggleValueTypes = (toggleType: string, value: string) => {
    this.setState({ [toggleType]: value });
  };

  _handleHoverBundle = (highlightBundle?: string = ''): void => {
    this.setState({ highlightBundle });
  };

  _handleBundlesChange = (bundles: Array<string>) => {
    this.props.history.push(bundles.length && bundles.length !== bundlesBySize.length ? `/${bundles.join('+')}` : '/');
  };

  _handleSelectBuild = (build: Build, bundleName: string) => {
    this.setState({
      builds: [...this.state.builds, build],
      selectedBuild: build
    });
  };

  _handleRemoveRevision = (revision: string) => {
    this.setState(() => ({
      builds: this.state.builds.filter(build => build.build.revision !== revision),
      selectedBuild: this.state.builds.length && this.state.builds[0]
    }));
  };

  _handleShowBuildInfo = (revision: string) => {
    this.setState(() => ({ selectedBuild: this.state.builds.find(build => build.build.revision === revision) }));
  };
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: '100vh',
    position: 'absolute',
    width: '100vw',
    top: 0,
    left: 0
  },
  data: {
    flexGrow: 0,
    minWidth: `${2 * (100 / theme.columns)}%`,
    maxWidth: `${6 * (100 / theme.columns)}%`
  },
  table: {
    overflowY: 'scroll',
    height: '80vh'
  },
  info: {},
  main: {
    height: '100vh',
    maxHeight: '100vh',
    overflowY: 'auto',
    flexGrow: 1
  },
  innerMain: {
    flexGrow: 1
  },
  scaleTypeButtons: {
    flex: 0,
    marginTop: theme.spaceSmall,
    marginRight: theme.spaceSmall,
    marginBottom: theme.spaceSmall
  }
});

export default App;
