import { select } from 'd3-selection';
import React, { Component } from 'react';
import { View } from 'react-native';

const CHART_ASPECT_RATIO = 4 / 3;

export default class Home extends Component {
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
      <View onLayout={this._handleLayout} style={{ height: '100%' }}>
        Home
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
    const { nativeEvent: { layout: { width, height: layoutHeight } } } = event;
    if (width !== this.state.width) {
      const height = Math.min(layoutHeight, width / CHART_ASPECT_RATIO);
      this.setState({ height, width });
    }
  };
}
