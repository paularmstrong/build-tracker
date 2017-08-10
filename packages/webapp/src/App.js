// @flow
import Bundles from './Bundles';
import Home from './Home';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from './theme';
import { bundlesBySize } from './stats';
import { interpolateRainbow, scaleSequential } from 'd3-scale';
import { ValueType, valueTypeAccessor, XScaleType, YScaleType } from './values';

const ViewAll = ({ match }) => (match ? <Link to="/">View All</Link> : null);

const colorScale = scaleSequential(interpolateRainbow).domain([0, bundlesBySize.length]);

class App extends Component {
  state: {
    commit?: Object,
    date?: Object,
    valueType: string,
    xScaleType: string,
    yScaleType: string
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
    const { commit, valueType } = this.state;
    return (
      <Router>
        <View style={styles.root}>
          <View style={styles.nav}>
            <Text role="heading">Bundles</Text>
            <Route children={ViewAll} exact path="/bundles/:bundle" />
            <Bundles
              bundles={bundlesBySize}
              colorScale={colorScale}
              commit={commit}
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
            <Route exact path="/" render={this._renderHome} />
            <Route path="/bundles/:bundleName" render={this._renderHome} />
          </View>
        </View>
      </Router>
    );
  }

  _renderHome = (props: Object) => {
    const { valueType, xScaleType, yScaleType } = this.state;
    return (
      <Home
        {...props}
        bundles={bundlesBySize}
        colorScale={colorScale}
        onPickCommit={this._handlePickCommit}
        valueAccessor={valueTypeAccessor[valueType]}
        xScaleType={xScaleType}
        yScaleType={yScaleType}
      />
    );
  };

  _handlePickCommit = (commit: Object): void => {
    this.setState({ commit });
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
