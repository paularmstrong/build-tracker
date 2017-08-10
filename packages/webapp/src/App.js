// @flow
import Bundles from './Bundles';
import Home from './Home';
import React, { Component } from 'react';
import { Button, StyleSheet, View } from 'react-native';
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
      xScaleType: XScaleType.COMMIT,
      yScaleType: YScaleType.LINEAR
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
    height: '100vh',
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
