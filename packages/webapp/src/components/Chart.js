// @flow
import 'd3-transition';
import deepEqual from 'deep-equal';
import theme from '../theme';
import { area, stack } from 'd3-shape';
import { extent, max } from 'd3-array';
import { mouse, select } from 'd3-selection';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { scaleBand, scaleTime, scaleLinear, scalePoint, scalePow } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { bytesToKb, formatTime, formatSha } from '../modules/formatting';
import { ChartType, XScaleType, YScaleType } from '../modules/values';

import type { Build } from '@build-tracker/flowtypes';

type StackedData = Array<Array<Array<number> & { data: Build }> & { index: number, key: string }>;

type MouseInformation = {
  xValue: number,
  yValue: number,
  hoveredBuild?: Build,
  hoveredArtifact?: Array<Array<number> & { data: Build }> & { index: number, key: string }
};

const margin = { top: 0, right: 20, bottom: 50, left: 60 };

const PERCENT_Y_HEADROOM = 1.05;
const MAX_HEIGHT = 800;

const getMouseInformation = (
  nodes: Array<Object>,
  xScale: Function,
  yScale: Function,
  data: StackedData,
  builds: Array<Build>
): MouseInformation => {
  const [xPos, yPos] = mouse(nodes[0]);

  let xValue;
  let xIndex;
  let hoveredBuild;
  if (xScale.invert) {
    const xDate = xScale.invert(xPos);
    const validTimestamps = builds.map(d => d.meta.timestamp);
    xValue = validTimestamps.reduce((prev, curr) => (Math.abs(curr - xDate) < Math.abs(prev - xDate) ? curr : prev), 0);
    xIndex = validTimestamps.indexOf(xValue);
    hoveredBuild = builds.find(build => build.meta.timestamp === xValue);
  } else {
    const domain = xScale.domain();
    xValue = domain.reduce((prev, curr, i) => {
      return Math.abs(xScale(curr) - xPos) > Math.abs(xScale(prev) - xPos) ? prev : curr;
    }, domain[0]);
    xIndex = builds.findIndex(
      build => (typeof xValue === 'string' ? build.meta.revision === xValue : build.meta.timestamp === xValue)
    );
    hoveredBuild = builds[xIndex];
  }

  const yValue = yScale.invert(yPos);
  const hoveredArtifact = data.find(data => data[xIndex][0] < yValue && data[xIndex][1] > yValue);

  return {
    xValue,
    yValue,
    hoveredBuild,
    hoveredArtifact
  };
};

type Props = {
  activeArtifactNames: Array<string>,
  artifacts: Array<string>,
  builds: Array<Build>,
  chartType: $Values<typeof ChartType>,
  colorScale: Function,
  onHover: (artifactName?: string, build?: Build) => void,
  onSelectBuild: Function,
  selectedBuilds: Array<string>,
  valueAccessor: Function,
  xScaleType: $Values<typeof XScaleType>,
  yScaleType: $Values<typeof YScaleType>
};

type State = {
  height: number,
  width: number
};

export default class Chart extends Component<Props, State> {
  static defaultProps = {
    chartType: ChartType.BAR,
    selectedBuilds: []
  };

  _svgNode: ?any;
  _chartContents: any;
  _overlay: any;
  _hoverLine: any;
  _staticLines: any;
  _yAxis: any;
  _xAxis: any;

  constructor(props: Props, context: any) {
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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !deepEqual(this.props, nextProps) || !deepEqual(this.state, nextState);
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
    const { activeArtifactNames, chartType, builds, valueAccessor } = this.props;
    if (height === 0 || width === 0) {
      return;
    }

    const yScale = this._getYScale();
    const xScale = this._getXScale();

    const chartStack = stack();
    chartStack.keys(activeArtifactNames);
    chartStack.value((d, key) => (d.artifacts[key] ? valueAccessor(d.artifacts[key]) : 0));

    const data = chartStack(builds);

    switch (chartType) {
      case ChartType.BAR:
        this._drawBars(data, xScale, yScale);
        break;
      case ChartType.AREA:
        this._drawArea(data, xScale, yScale);
        break;
      default:
        throw new Error(`Chart type ${chartType} is unknown`);
    }

    this._drawXAxis(xScale);
    this._drawYAxis(yScale);
    this._drawLines(xScale);

    this._overlay
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .on('click', (d, index, nodes) => {
        const { hoveredBuild } = getMouseInformation(nodes, xScale, yScale, data, builds);
        this.props.onSelectBuild(hoveredBuild);
      })
      .on('mouseover', () => {
        this._hoverLine.style('opacity', 1);
      })
      .on('mouseout', () => {
        this._hoverLine.style('opacity', 0);
        this.props.onHover();
      })
      .on('mousemove', (d, index, nodes) => {
        const { xValue, hoveredBuild, hoveredArtifact } = getMouseInformation(nodes, xScale, yScale, data, builds);
        // const [xPos, yPos] = mouse(nodes[0]);
        const artifactName = hoveredArtifact && hoveredArtifact.key ? hoveredArtifact.key : undefined;

        const xSetter = v => (xScale.bandwidth ? xScale(v) + xScale.bandwidth() / 2 : xScale(v));
        this._hoverLine
          .attr('x1', xSetter(xValue))
          .attr('x2', xSetter(xValue))
          .attr('y1', 0)
          .attr('y2', height - margin.top - margin.bottom);
        this.props.onHover(artifactName, hoveredBuild);
        // TODO: add a tooltip
      });
  }

  _drawArea(data: Array<Array<number>>, xScale: Function, yScale: Function) {
    const { artifacts, colorScale, xScaleType } = this.props;
    const xAccessor = xScaleType === 'time' ? 'timestamp' : 'revision';

    const areaChart = area()
      .x(d => xScale(d.data.meta[xAccessor]))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]));

    const artifact = this._chartContents.selectAll('.artifact').data(data, (d: { key: string }) => d.key);
    const builds = this._chartContents.selectAll('g.build').data([]);
    builds.exit().remove();

    // Remove old areas
    artifact.exit().remove();

    artifact
      .enter()
      .append('path')
      .attr('class', 'artifact')
      .style('fill', (d, i) => colorScale(artifacts.length - artifacts.indexOf(d.key)))
      .merge(artifact)
      .transition()
      .duration(150)
      .attr('d', areaChart);
  }

  _drawBars(data: Array<Array<number>>, xScale: Function, yScale: Function) {
    const { artifacts, colorScale, xScaleType } = this.props;
    const { height } = this.state;

    const xAccessor = xScaleType === 'time' ? 'timestamp' : 'revision';
    const artifactGroups = this._chartContents.selectAll('g.artifactGroup').data(data, (d: { key: string }) => d.key);
    const artifact = this._chartContents.selectAll('path.artifact').data([]);
    artifact.exit().remove();

    // Remove old artifacts
    artifactGroups.exit().remove();

    const artifactRects = artifactGroups
      .enter()
      .append('g')
      .attr('class', 'artifactGroup')
      .style('fill', (d, i) => colorScale(artifacts.length - artifacts.indexOf(d.key)))
      .merge(artifactGroups)
      .selectAll('rect.artifact')
      .data(d => d);

    artifactRects.exit().remove();

    artifactRects
      .enter()
      .append('rect')
      .attr('class', 'artifact')
      .attr('x', d => xScale(d.data.meta[xAccessor]))
      .attr('y', d => height - margin.top - margin.bottom)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .merge(artifactRects)
      .transition()
      .duration(150)
      .attr('x', d => xScale(d.data.meta[xAccessor]))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth());
  }

  _setSvgRef = (node: any) => {
    if (node && node !== this._svgNode) {
      this._svgNode = node;
      const svg = select(node)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      this._chartContents = svg.append('g');
      this._overlay = svg
        .append('rect')
        .style('fill', 'none')
        .style('pointer-events', 'all');
      this._staticLines = svg.append('g');
      this._hoverLine = svg
        .append('line')
        .style('stroke', theme.colorWhite)
        .style('fill', 'none')
        .style('stroke-width', '2px')
        .style('stroke-dasharray', '3 3')
        .style('opacity', 0);
      this._xAxis = svg.append('g').attr('class', 'x axis');
      this._yAxis = svg.append('g').attr('class', 'y axis');
    }
  };

  _drawLines(xScale: Function) {
    const { height } = this.state;
    const { selectedBuilds, builds, xScaleType } = this.props;
    const data =
      xScaleType === XScaleType.TIME
        ? builds.filter(d => selectedBuilds.indexOf(d.meta.revision) !== -1).map(d => d.meta.timestamp)
        : selectedBuilds;
    const lines = this._staticLines.selectAll('line').data(data);
    lines.exit().remove();

    const xSetter = v => (xScale.bandwidth ? xScale(v) + xScale.bandwidth() / 2 : xScale(v));
    lines
      .enter()
      .append('line')
      .style('stroke', theme.colorWhite)
      .style('fill', 'none')
      .style('stroke-width', '2px')
      .style('stroke-dasharray', '3 3')
      .merge(lines)
      .attr('x1', xSetter)
      .attr('x2', xSetter)
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
    const yAxis = axisLeft()
      .scale(yScale)
      .tickFormat(v => bytesToKb(v, ''));
    this._yAxis
      .transition()
      .duration(150)
      .call(yAxis);
  }

  _handleLayout = (event: Object) => {
    const { nativeEvent: { layout: { width, height } } } = event;
    if (width !== this.state.width) {
      this.setState({ height: Math.min(height, MAX_HEIGHT), width });
    }
  };

  _getXScale() {
    const { chartType, builds, xScaleType } = this.props;
    const { width } = this.state;

    const range = [0, width - (margin.left + margin.right)];
    const timeRange = [range[0] + 10, range[1] - 10];
    const domain = builds.sort((a, b) => new Date(a.meta.timestamp) - new Date(b.meta.timestamp));
    const padding = 0.25;

    switch (xScaleType) {
      case XScaleType.TIME:
        if (chartType === ChartType.BAR) {
          return scaleBand()
            .rangeRound(range)
            .padding(padding)
            .domain(domain.map(d => d.meta.timestamp));
        }
        return scaleTime()
          .range(timeRange)
          .domain(extent(builds, d => d.meta.timestamp));

      case XScaleType.COMMIT:
      default: {
        const commitDomain = domain.map(d => d.meta.revision);
        return chartType === ChartType.BAR
          ? scaleBand()
              .rangeRound(range)
              .padding(padding)
              .domain(commitDomain)
          : scalePoint()
              .range(range)
              .padding(padding)
              .round(true)
              .domain(commitDomain);
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
    const { activeArtifactNames, builds, valueAccessor, yScaleType } = this.props;
    const { height } = this.state;

    const maxDateVal = max(builds, build => {
      return Object.values(build.artifacts).reduce(
        (memo: number, artifact) =>
          memo +
          (artifact && typeof artifact.name === 'string' && activeArtifactNames.indexOf(artifact.name) > -1
            ? valueAccessor(artifact)
            : 0),
        0
      );
    });

    const range = [height - (margin.top + margin.bottom), 0];
    const domain = [0, maxDateVal * PERCENT_Y_HEADROOM];

    switch (yScaleType) {
      case YScaleType.POW:
        return scalePow()
          .exponent(4)
          .range(range)
          .domain(domain);
      case YScaleType.LINEAR:
      default:
        return scaleLinear()
          .range(range)
          .domain(domain);
    }
  }
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    height: '100%'
  }
});
