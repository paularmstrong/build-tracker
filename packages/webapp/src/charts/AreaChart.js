import { area, stack } from 'd3-shape';
import { extent, max } from 'd3-array';
import { select } from 'd3-selection';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { interpolateRainbow, scaleSequential, scaleTime, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat } from 'd3-time-format';
import 'd3-transition';

const color = scaleSequential(interpolateRainbow);
const margin = { top: 20, right: 20, bottom: 100, left: 60 };
const singleItemData = [[]];
const formatTime = timeFormat('%Y-%m-%d %H:%M');

const PERCENT_Y_HEADROOM = 1.05;

export default class AreaChart extends Component {
  props: {
    bundles: Array<string>,
    stats: Array<object>
  };

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
        <svg ref={this._setSvgRef} height={height} width={width} />
      </View>
    );
  }

  _renderChart() {
    const { height, width } = this.state;
    if (height === 0 || width === 0) {
      return;
    }
    const { bundles, stats } = this.props;

    const maxDateVal = max(this.props.stats, commit => {
      return Object.values(commit.stats).reduce((memo, bundle) => memo + (bundle ? bundle.gzipSize : 0), 0);
    });

    color.domain([0, bundles.length]);

    const x = scaleTime().range([0, width - (margin.left + margin.right)]);
    const y = scaleLinear().range([height - (margin.top + margin.bottom), 0]);
    x.domain(extent(stats, d => d.build.timestamp));
    y.domain([0, maxDateVal * PERCENT_Y_HEADROOM]);

    const xAxis = axisBottom().scale(x).tickFormat(formatTime);
    const yAxis = axisLeft().scale(y);

    const areaChart = area().x(d => x(d.data.build.timestamp)).y0(d => y(d[0])).y1(d => y(d[1]));

    const chartStack = stack();
    chartStack.keys(bundles.sort((a, b) => stats[0].stats[b].gzipSize - stats[0].stats[a].gzipSize));
    chartStack.value((d, key) => (d.stats[key] ? d.stats[key].gzipSize : 0));

    const data = chartStack(stats);

    const bundle = this._svg.selectAll('.bundle').data(data, d => (bundles.length > 1 ? d.key : 'constant'));

    // Remove old areas
    bundle.exit().remove();

    bundle
      .enter()
      .append('path')
      .attr('class', 'bundle')
      .merge(bundle)
      .transition()
      .duration(150)
      .attr('d', areaChart)
      .style('fill', (d, i) => color(bundles.indexOf(d.key)));

    this._xAxis
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .transition()
      .duration(150)
      .call(xAxis)
      .selectAll('text')
      .attr('y', 9)
      .attr('x', 5)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(20)')
      .style('text-anchor', 'start');

    this._yAxis.transition().duration(150).call(yAxis);
  }

  _setSvgRef = node => {
    if (node !== this._svgNode) {
      this._svgNode = node;
      this._svg = select(node).append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      this._xAxis = this._svg.append('g').attr('class', 'x axis');
      this._yAxis = this._svg.append('g').attr('class', 'y axis');
    }
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
