// @flow
import Bundles from './Bundles';
import deepEqual from 'deep-equal';
import Main from './Main';
import React, { Component } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import theme from './theme';
import { bundlesBySize } from './stats';
import { interpolateRainbow, scaleSequential } from 'd3-scale';
import { ValueType, valueTypeAccessor, XScaleType, YScaleType } from './values';

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
    commit?: Object,
    date?: Object,
    valueType: string,
    xScaleType: string,
    yScaleType: string
  };

  props: {
    history: RouterHistory,
    match: Match
  };

  _activeBundles: Array<string>;

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      valueType: ValueType.GZIP,
      xScaleType: XScaleType.COMMIT,
      yScaleType: YScaleType.LINEAR
    };
    this._activeBundles = _getActiveBundles(props);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (!deepEqual(this.props.match.params, nextProps.match.params)) {
      this._activeBundles = _getActiveBundles(nextProps);
    }
  }

  render() {
    const { highlightBundle, valueType, xScaleType, yScaleType } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.nav}>
          <Bundles
            activeBundles={this._activeBundles}
            bundles={bundlesBySize}
            colorScale={colorScale}
            highlightBundle={highlightBundle}
            onBundlesChange={this._handleBundlesChange}
            valueAccessor={valueTypeAccessor[valueType]}
          />
        </View>
        <View style={styles.main}>
          <View style={styles.scaleTypeButtons}>
            <View style={styles.buttonGroup}>
              {Object.values(ValueType).map(value =>
                <Button
                  color={theme.colorSalmon}
                  disabled={valueType === value}
                  key={value}
                  onPress={this._handleValueTypeChange}
                  size="small"
                  style={styles.button}
                  title={value}
                  value={value}
                />
              )}
            </View>
            <View style={styles.buttonGroup}>
              {Object.values(YScaleType).map(scale =>
                <Button
                  color={theme.colorOrange}
                  disabled={yScaleType === scale}
                  key={scale}
                  onPress={this._handleYScaleChange}
                  size="small"
                  style={styles.button}
                  title={scale}
                  value={scale}
                />
              )}
            </View>
            <View style={styles.buttonGroup}>
              {Object.values(XScaleType).map(scale =>
                <Button
                  color={theme.colorGreen}
                  disabled={xScaleType === scale}
                  key={scale}
                  onPress={this._handleXScaleChange}
                  size="small"
                  style={styles.button}
                  title={scale}
                  value={scale}
                />
              )}
            </View>
          </View>
          <View style={styles.innerMain}>
            <Main
              activeBundles={this._activeBundles}
              bundles={bundlesBySize}
              colorScale={colorScale}
              onHoverBundle={this._handleHoverBundle}
              valueAccessor={valueTypeAccessor[valueType]}
              xScaleType={xScaleType}
              yScaleType={yScaleType}
            />
          </View>
        </View>
      </View>
    );
  }

  _handleHoverBundle = (highlightBundle?: string = ''): void => {
    this.setState({ highlightBundle });
  };

  _handleYScaleChange = (event: { target: { innerText: string } }): void => {
    const { target: { innerText: yScaleType } } = event;
    this.setState({ yScaleType });
  };

  _handleXScaleChange = (event: { target: { innerText: string } }): void => {
    const { target: { innerText: xScaleType } } = event;
    this.setState({ xScaleType });
  };

  _handleValueTypeChange = (event: { target: { innerText: string } }): void => {
    const { target: { innerText: valueType } } = event;
    this.setState({ valueType });
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spaceSmall,
    marginRight: theme.spaceSmall,
    marginBottom: theme.spaceSmall
  },
  buttonGroup: {
    flexDirection: 'row',
    marginLeft: theme.spaceSmall
  },
  button: {
    fontSize: '12px'
  }
});

export default App;
