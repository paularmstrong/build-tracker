// @flow
import Bundles from './Bundles';
import Home from './Home';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from './theme';
import { bundlesBySize } from './stats';
import { interpolateRainbow, scaleSequential } from 'd3-scale';
import { ValueType, valueTypeAccessor, XScaleType, YScaleType } from './values';

const colorScale = scaleSequential(interpolateRainbow).domain([0, bundlesBySize.length]);

class App extends Component {
  state: {
    highlightBundle?: string,
    commit?: Object,
    date?: Object,
    valueType: string,
    xScaleType: string,
    yScaleType: string
  };

  props: {
    history: { push: Function },
    match: Object
  };

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      valueType: ValueType.GZIP,
      xScaleType: 'commit',
      yScaleType: 'linear'
    };
  }

  render() {
    const { highlightBundle, commit, valueType, xScaleType, yScaleType } = this.state;
    const activeBundles = this._getActiveBundles();
    return (
      <View style={styles.root}>
        <View style={styles.nav}>
          <Bundles
            activeBundles={activeBundles}
            bundles={bundlesBySize}
            colorScale={colorScale}
            commit={commit}
            highlightBundle={highlightBundle}
            onBundlesChange={this._handleBundlesChange}
            valueAccessor={valueTypeAccessor[valueType]}
          />
        </View>
        <View style={styles.main}>
          <View style={styles.scaleTypeButtons}>
            {Object.values(ValueType).map(value =>
              <View key={value} style={styles.scaleTypeButton}>
                <button value={value} onClick={this._handleValueTypeChange}>
                  {value}
                </button>
              </View>
            )}
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
          <Home
            activeBundles={activeBundles}
            bundles={bundlesBySize}
            colorScale={colorScale}
            onPickCommit={this._handlePickCommit}
            valueAccessor={valueTypeAccessor[valueType]}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
          />
        </View>
      </View>
    );
  }

  _getActiveBundles(): Array<string> {
    const { match: { params } } = this.props;
    const { bundleNames } = params;
    if (!bundleNames) {
      return bundlesBySize;
    } else {
      const bundles = bundleNames.split('+');
      return bundlesBySize.filter(b => bundles.indexOf(b) !== -1);
    }
  }

  _handlePickCommit = (commit: Object, highlightBundle: string): void => {
    this.setState({ highlightBundle, commit });
  };

  _handleYScaleChange = (event: { target: { value: string } }): void => {
    const { target: { value: yScaleType } } = event;
    this.setState({ yScaleType });
  };

  _handleXScaleChange = (event: { target: { value: string } }): void => {
    const { target: { value: xScaleType } } = event;
    this.setState({ xScaleType });
  };

  _handleValueTypeChange = (event: { target: { value: string } }): void => {
    const { target: { value: valueType } } = event;
    this.setState({ valueType });
  };

  _handleBundlesChange = (bundles: Array<string>) => {
    this.props.history.push(
      bundles.length && bundles.length !== bundlesBySize.length ? `/bundles/${bundles.join('+')}` : '/'
    );
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
    flexBasis: `${3 * (100 / theme.columns)}%`,
    overflowY: 'scroll'
  },
  main: {
    flexGrow: 1,
    height: '100vh'
  },
  scaleTypeButtons: {
    flexDirection: 'row'
  },
  scaleTypeButton: {
    flexGrow: 1
  }
});

export default App;
