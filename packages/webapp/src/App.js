// @flow
import Bundles from './Bundles';
import deepEqual from 'deep-equal';
import Main from './Main';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from './theme';
import Toggles from './Toggles';
import { bundlesBySize } from './stats';
import { interpolateRainbow, scaleSequential } from 'd3-scale';
import { Types, TypesEnum, ValueType, valueTypeAccessor, XScaleType, YScaleType } from './values';

import type { Match, RouterHistory } from 'react-router-dom';

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
    highlightBundle?: string,
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
    const { highlightBundle, values, xscale, yscale } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.nav}>
          <Bundles
            activeBundles={this._activeBundles}
            bundles={bundlesBySize}
            colorScale={colorScale}
            highlightBundle={highlightBundle}
            onBundlesChange={this._handleBundlesChange}
            valueAccessor={valueTypeAccessor[values]}
          />
        </View>
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
              bundles={bundlesBySize}
              colorScale={colorScale}
              onHoverBundle={this._handleHoverBundle}
              valueAccessor={valueTypeAccessor[values]}
              xScaleType={xscale}
              yScaleType={yscale}
            />
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
  nav: {
    flexGrow: 0,
    flexBasis: `${2 * (100 / theme.columns)}%`,
    overflowY: 'scroll'
  },
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
