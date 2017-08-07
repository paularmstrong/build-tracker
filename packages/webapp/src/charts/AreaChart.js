import { area, stack } from 'd3-shape';
import { extent, max } from 'd3-array';
import { select } from 'd3-selection';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { interpolateRainbow, schemeCategory20, scaleSequential, scaleOrdinal, scaleTime, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat } from 'd3-time-format';

const color = scaleSequential(interpolateRainbow);
const margin = { top: 20, right: 20, bottom: 100, left: 60 };
const singleItemData = [[]];
const formatTime = timeFormat('%Y-%m-%d %H:%M');

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
    return (
      <View onLayout={this._handleLayout} style={styles.root}>
        <svg ref={this._setSvgRef} />
      </View>
    );
  }

  _renderChart() {
    const { height, width } = this.state;
    if (height === 0 || width === 0) {
      return;
    }
    const { bundles, stats } = this.props;
    const svg = select(this._svg).attr('width', width).attr('height', height);

    const g = svg
      .selectAll('g')
      .data(singleItemData)
      .enter()
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxDateVal = max(this.props.stats, commit => {
      return Object.values(commit.stats).reduce((memo, bundle) => memo + bundle.gzipSize, 0);
    });

    color.domain([0, bundles.length - 1]);

    const x = scaleTime().range([0, width - (margin.left + margin.right)]);
    const y = scaleLinear().range([height - (margin.top + margin.bottom), 0]);
    x.domain(extent(stats, d => d.build.timestamp));
    y.domain([0, maxDateVal]);

    const xAxis = axisBottom().scale(x).tickFormat(formatTime);
    const yAxis = axisLeft().scale(y);

    const areaChart = area().x(d => x(d.data.build.timestamp)).y0(d => y(d[0])).y1(d => y(d[1]));

    const chartStack = stack();
    chartStack.keys(bundles.sort((a, b) => stats[0].stats[b].gzipSize - stats[0].stats[a].gzipSize));
    chartStack.value((d, key) => (d.stats[key] ? d.stats[key].gzipSize : 0));

    const data = chartStack(stats);

    const bundle = g.selectAll('.bundle').data(data).enter().append('g').attr('data-key', d => d.key);

    bundle.append('path').attr('d', areaChart).style('fill', (d, i) => color(bundles.indexOf(d.key)));

    g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(xAxis)
      .selectAll('text')
      .attr('y', 9)
      .attr('x', 5)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(20)')
      .style('text-anchor', 'start');

    g.append('g').attr('class', 'y axis').call(yAxis);
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
    flexGrow: 1,
    height: '100%'
  }
});
