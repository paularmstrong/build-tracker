/**
 * Copyright (c) 2019 Paul Armstrong
 */
import 'd3-transition';
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import { hsl } from 'd3-color';
import React from 'react';
import { select } from 'd3-selection';
import { area, Series } from 'd3-shape';
import { ScaleLinear, ScalePoint, ScaleSequential } from 'd3-scale';

interface Props {
  activeArtifactNames: Array<string>;
  colorScale: ScaleSequential<string>;
  comparator: Comparator;
  data: Array<Series<Build, string>>;
  hoveredArtifacts: Array<string>;
  xScale: ScalePoint<string>;
  yScale: ScaleLinear<number, number>;
}

const Area = (props: Props): React.ReactElement => {
  const { activeArtifactNames, comparator, data, hoveredArtifacts, xScale, yScale } = props;
  const colorScale = props.colorScale.domain([0, comparator.artifactNames.length]);
  const gRef = React.useRef(null);

  const graphColorScale = React.useMemo(() => {
    return d => {
      const color = hsl(colorScale(comparator.artifactNames.indexOf(d.key)));
      if (hoveredArtifacts.length && !hoveredArtifacts.includes(d.key)) {
        color.l = 0.75;
        color.s = 0.4;
      }
      return color.toString();
    };
  }, [colorScale, comparator.artifactNames, hoveredArtifacts]);

  React.useEffect(() => {
    const contents = select(gRef.current);

    const areaChart = area()
      // @ts-ignore d.data does exist
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
      .style('fill', graphColorScale)
      .attr('aria-label', d => d.key)
      // @ts-ignore Docs are very clear that this is allowed
      .merge(artifact)
      .transition()
      .duration(100)
      .style('fill', graphColorScale)
      .attr('d', areaChart);
  });

  return <g aria-label={`Stacked area chart for ${activeArtifactNames.join(', ')}`} pointerEvents="all" ref={gRef} />;
};

export default Area;
