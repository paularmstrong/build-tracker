// @flow
import { area, stack } from 'd3-shape';
import { extent, max } from 'd3-array';
import { mouse, select } from 'd3-selection';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { scaleTime, scaleLinear, scalePoint, scalePow } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { bytesToKb, formatTime, formatSha } from '../formatting';
import { XScaleType, YScaleType } from '../values';
import { getAverageSize } from '../stats';
import theme from '../theme';
import 'd3-transition';

const margin = { top: 0, right: 20, bottom: 50, left: 60 };

const PERCENT_Y_HEADROOM = 1.05;

type bundleStatType = {
  hash: string,
  name: string,
  size: number,
  gzipSize: number
};

export default class AreaChart extends PureComponent {
  props: {
    activeBundles: Array<string>,
    bundles: Array<string>,
    colorScale: Function,
    onSelectBuild: Function,
    selectedBuilds: Array<string>,
    valueAccessor: Function,
    yScaleType: $Values<typeof YScaleType>,
    xScaleType: $Values<typeof XScaleType>,
    stats: Array<{
      build: { timestamp: number, revision: string },
      stats: { [bundleName: string]: bundleStatType }
    }>
  };

  static defaultProps = {
    selectedBuilds: []
  };

  state: {
    width: number,
    height: number
  };

  _svgNode: any;
  _chartContents: any;
  _overlay: any;
  _hoverLine: any;
  _yAxis: any;
  _xAxis: any;

  constructor(props: Object, context: Object) {
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
        <View ref={this._setTooltipRef} />
      </View>
    );
  }

  _renderChart() {
    const { height, width } = this.state;
    const { activeBundles, bundles, colorScale, stats, valueAccessor, xScaleType } = this.props;
    if (height === 0 || width === 0) {
      return;
    }

    const yScale = this._getYScale();
    const xScale = this._getXScale();

    const xAccessor = xScaleType === 'time' ? 'timestamp' : 'revision';
    const areaChart = area().x(d => xScale(d.data.build[xAccessor])).y0(d => yScale(d[0])).y1(d => yScale(d[1]));

    const chartStack = stack();
    chartStack.keys(activeBundles.sort((a, b) => getAverageSize(stats, b) - getAverageSize(stats, a)));
    chartStack.value((d, key) => (d.stats[key] ? valueAccessor(d.stats[key]) : 0));

    const data = chartStack(stats);

    const bundle = this._chartContents
      .selectAll('.bundle')
      .data(data, d => (activeBundles.length > 1 ? d.key : 'constant'));

    // Remove old areas
    bundle.exit().remove();

    bundle
      .enter()
      .append('path')
      .attr('class', 'bundle')
      .style('fill', (d, i) => colorScale(bundles.length - bundles.indexOf(d.key)))
      .merge(bundle)
      .transition()
      .duration(150)
      .attr('d', areaChart);

    this._drawXAxis(xScale);
    this._drawYAxis(yScale);

    const getMouseInformation = nodes => {
      const [xPos, yPos] = mouse(nodes[0]);

      let xValue;
      let xIndex;
      let hoveredStats;
      if (xScale.invert) {
        const xDate = xScale.invert(xPos);
        const validTimestamps = stats.map(d => d.build.timestamp);
        xValue = validTimestamps.reduce(
          (prev, curr) => (Math.abs(curr - xDate) < Math.abs(prev - xDate) ? curr : prev),
          0
        );
        xIndex = validTimestamps.indexOf(xValue);
        hoveredStats = stats.find(commit => commit.build.timestamp === xValue);
      } else {
        const domain = xScale.domain();
        xValue = domain.reduce((prev, curr, i) => {
          return Math.abs(xScale(curr) - xPos) > Math.abs(xScale(prev) - xPos) ? prev : curr;
        }, domain[0]);
        xIndex = stats.findIndex(commit => commit.build.revision === xValue);
        hoveredStats = stats[xIndex];
      }

      const yValue = yScale.invert(yPos);
      const hoveredBundle = data.find(data => data[xIndex][0] < yValue && data[xIndex][1] > yValue);
      return {
        xValue,
        yValue,
        hoveredStats,
        hoveredBundle
      };
    };

    this._drawLines(xScale);

    this._overlay
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .on('click', (d, index, nodes) => {
        const { hoveredStats } = getMouseInformation(nodes);
        this.props.onSelectBuild(hoveredStats);
      })
      .on('mouseover', () => {
        this._hoverLine.style('opacity', 1);
      })
      .on('mouseout', () => {
        this._hoverLine.style('opacity', 0);
      })
      .on('mousemove', (d, index, nodes) => {
        const { xValue, hoveredStats, hoveredBundle } = getMouseInformation(nodes);
        const [xPos, yPos] = mouse(nodes[0]);

        this._hoverLine
          .attr('x1', xScale(xValue))
          .attr('x2', xScale(xValue))
          .attr('y1', 0)
          .attr('y2', height - margin.top - margin.bottom);
        // TODO: add a tooltip
      });
  }

  _setSvgRef = (node: Object) => {
    if (node !== this._svgNode) {
      this._svgNode = node;
      const svg = select(node).append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      this._chartContents = svg.append('g');
      this._overlay = svg.append('rect').style('fill', 'none').style('pointer-events', 'all');
      this._staticLines = svg.append('g');
      this._hoverLine = svg
        .append('line')
        .style('stroke', theme.colorBlack)
        .style('fill', 'none')
        .style('stroke-width', '1px')
        .style('stroke-dasharray', '3 3')
        .style('opacity', 0);
      this._xAxis = svg.append('g').attr('class', 'x axis');
      this._yAxis = svg.append('g').attr('class', 'y axis');
    }
  };

  _drawLines(xScale) {
    const { height } = this.state;
    const { selectedBuilds } = this.props;
    const lines = this._staticLines.selectAll('line').data(selectedBuilds);
    lines.exit().remove();
    lines
      .enter()
      .append('line')
      .style('stroke', theme.colorBlack)
      .style('fill', 'none')
      .style('stroke-width', '1px')
      .style('stroke-dasharray', '1 1')
      .merge(lines)
      .attr('x1', xScale)
      .attr('x2', xScale)
      .attr('y1', 0)
      .attr('y2', height - margin.top - margin.bottom);
  }

  _drawXAxis(xScale: Object) {
    const { height } = this.state;
    const xAxis = this._getXAxis(xScale);
    this._xAxis
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .transition()
      .duration(150)
      .call(xAxis)
      .selectAll('text')
      .attr('y', 9)
      .attr('x', 5)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(24)')
      .style('text-anchor', 'start');
  }

  _drawYAxis(yScale: Object) {
    const yAxis = axisLeft().scale(yScale).tickFormat(v => bytesToKb(v, false));
    this._yAxis.transition().duration(150).call(yAxis);
  }

  _handleLayout = (event: Object) => {
    const { nativeEvent: { layout: { width, height } } } = event;
    if (width !== this.state.width) {
      this.setState({ height, width });
    }
  };

  _getXScale() {
    const { stats, xScaleType } = this.props;
    const { width } = this.state;

    const range = [0, width - (margin.left + margin.right)];
    switch (xScaleType) {
      case XScaleType.TIME:
        return scaleTime().range(range).domain(extent(stats, d => d.build.timestamp));

      case XScaleType.COMMIT:
      default: {
        const domain = stats
          .sort((a, b) => new Date(a.build.timestamp) - new Date(b.build.timestamp))
          .map(d => d.build.revision);
        return scalePoint().range(range).round(true).domain(domain);
      }
    }
  }

  _getXAxis(scale: Object) {
    const { xScaleType } = this.props;
    const axis = axisBottom().scale(scale);
    switch (xScaleType) {
      case XScaleType.TIME:
        axis.tickFormat(formatTime);
        break;

      default:
        axis.tickFormat(d => d && formatSha(d));
        break;
    }
    return axis;
  }

  _getYScale() {
    const { activeBundles, stats, valueAccessor, yScaleType } = this.props;
    const { height } = this.state;

    const maxDateVal = max(stats, commit => {
      return Object.values(commit.stats).reduce(
        (memo: number, bundle) =>
          memo +
          (bundle && typeof bundle.name === 'string' && activeBundles.indexOf(bundle.name) > -1
            ? valueAccessor(bundle)
            : 0),
        0
      );
    });

    const range = [height - (margin.top + margin.bottom), 0];
    const domain = [0, maxDateVal * PERCENT_Y_HEADROOM];

    switch (yScaleType) {
      case YScaleType.POW:
        return scalePow().exponent(4).range(range).domain(domain);
      case YScaleType.LINEAR:
      default:
        return scaleLinear().range(range).domain(domain);
    }
  }
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    height: '100%'
  }
});
