import { select } from 'd3-selection';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

export default class AreaChart extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    this._renderChart();
  }

  componentDidUpdate() {
    this._renderChart();
  }

  render() {
    const { height, width } = this.state;
    return (
      <View onLayout={this._handleLayout} style={styles.root}>
        <svg ref={this._setSvgRef} width={width} height={height} />
      </View>
    );
  }

  _renderChart() {
    select(this._svg);
  }

  _setSvgRef = node => {
    this._svg = node;
  };

  _handleLayout = event => {
    const { nativeEvent: { layout: { width, height } } } = event;
    if (width !== this.state.width) {
      this.setState({ height, width });
    }
  };
}

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%'
  }
});
