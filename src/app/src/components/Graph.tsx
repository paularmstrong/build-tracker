import 'd3-transition';
import Build from '@build-tracker/build';
import React from 'react';
import Comparator from '@build-tracker/comparator';
import { area, stack } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';
import { formatBytes, formatSha } from '@build-tracker/formatting';
import { select, Selection } from 'd3-selection';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { scaleLinear, scalePoint } from 'd3-scale';

interface Props {
  comparator: Comparator;
  sizeKey: string;
}

const Graph = (props: Props): React.ReactElement => {
  const { comparator, sizeKey } = props;
  const [{ width, height }, setDimensions] = React.useState({ width: 0, height: 0 });
  const svgRef = React.useRef(null);
  const [svg, setSvg] = React.useState<Selection<SVGGElement, {}, SVGElement, null>>(null);

  const xScale = React.useMemo(() => {
    const domain = comparator.builds
      .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf())
      .map(build => build.getMetaValue('revision'));
    return scalePoint()
      .range([0, width - 100])
      .padding(0.25)
      .round(true)
      .domain(domain);
  }, [comparator, width]);

  const yScale = React.useMemo(() => {
    const totals = comparator.builds.map(build => build.getTotals()[sizeKey]);
    const maxTotal = Math.max(...totals);
    return scaleLinear()
      .range([height - 100, 0])
      .domain([0, maxTotal]);
  }, [comparator, height]);

  const drawAxes = React.useMemo(
    () => () => {
      if (
        !svgRef.current ||
        !select(svgRef.current)
          .select('g')
          .empty()
      ) {
        return;
      }

      const svg = select(svgRef.current)
        .append('g')
        .attr('transform', 'translate(80,20)');
      svg.append('g').attr('class', 'xAxis');
      svg.append('g').attr('class', 'yAxis');
      svg.append('g').attr('class', 'contents');
      setSvg(svg);
    },
    [svgRef.current]
  );

  React.useEffect(() => {
    if (!svgRef.current || !height || !width) {
      return;
    }
    drawAxes();

    if (!svg) {
      return;
    }

    const xAxis = axisBottom(xScale).tickFormat(d => formatSha(d));
    svg
      .select('g.xAxis')
      .call(xAxis)
      .attr('transform', `translate(0, ${height - 100})`)
      .selectAll('text')
      .attr('y', 3)
      .attr('x', 6)
      .attr('transform', 'rotate(24)')
      .style('text-anchor', 'start');

    const yAxis = axisLeft(yScale).tickFormat(d => formatBytes(d.valueOf()));
    svg.select('g.yAxis').call(yAxis);

    const dataStack = stack();
    dataStack.keys(comparator.artifactNames);
    // @ts-ignore
    dataStack.value((build: Build, key) => {
      const artifact = build.getArtifact(key);
      return artifact ? artifact.sizes[sizeKey] : 0;
    });

    // @ts-ignore
    const data = dataStack(comparator.builds);

    const contents = svg.select('g.contents');

    const areaChart = area()
      // @ts-ignore
      .x(d => xScale(d.data.getMetaValue('revision')))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]));

    const artifact = contents.selectAll('.artifact').data(data, (d: { key: string }) => d.key);
    const builds = contents.selectAll('.build').data([]);
    builds.exit().remove();

    artifact.exit().remove();

    artifact
      .enter()
      .append('path')
      .attr('class', 'artifact')
      .style('fill', '#000000')
      // @ts-ignore
      .merge(artifact)
      .transition()
      .duration(100)
      // .style('fill', d => {

      // })
      .attr('d', areaChart);
  });

  const handleLayout = (event: LayoutChangeEvent): void => {
    const {
      nativeEvent: {
        layout: { height, width }
      }
    } = event;
    setDimensions({ height, width });
  };

  return (
    <View onLayout={handleLayout} style={styles.root}>
      <svg height={height} ref={svgRef} width={width} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    width: '100%',
    maxHeight: 'calc(100% - 4rem)',
    overflow: 'hidden'
  }
});

export default Graph;
