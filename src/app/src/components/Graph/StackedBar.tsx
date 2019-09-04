/**
 * Copyright (c) 2019 Paul Armstrong
 */
import 'd3-transition';
import Build from '@build-tracker/build';
import { hsl } from 'd3-color';
import React from 'react';
import { select } from 'd3-selection';
import { Series } from 'd3-shape';
import { ScaleBand, ScaleLinear, ScaleSequential } from 'd3-scale';

interface Props {
  activeArtifactNames: Array<string>;
  artifactNames: Array<string>;
  colorScale: ScaleSequential<string>;
  data: Array<Series<Build, string>>;
  height: number;
  hoveredArtifacts: Array<string>;
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
}

const Area = (props: Props): React.ReactElement => {
  const { activeArtifactNames, artifactNames, colorScale, data, height, hoveredArtifacts, xScale, yScale } = props;

  const gRef = React.useRef(null);

  const graphColorScale = React.useMemo(() => {
    return d => {
      const color = hsl(colorScale(artifactNames.indexOf(d.key)));
      if (hoveredArtifacts.length && !hoveredArtifacts.includes(d.key)) {
        color.l = 0.75;
        color.s = 0.4;
      }
      return color.toString();
    };
  }, [colorScale, artifactNames, hoveredArtifacts]);

  React.useEffect(() => {
    const contents = select(gRef.current);

    const groups = contents.selectAll('g.artifactGroup').data(data, (d: { key: string }): string => d.key);
    groups
      .transition()
      .duration(150)
      .style('fill', graphColorScale);

    groups.exit().remove();

    const rects = groups
      .enter()
      .append('g')
      .attr('class', 'artifactGroup')
      .attr('aria-label', d => d.key)
      .style('fill', graphColorScale)
      // @ts-ignore
      .merge(groups)
      .selectAll('rect.artifact')
      .data(d => d);

    rects.exit().remove();

    rects
      .enter()
      .append('rect')
      .attr('class', 'artifact')
      .attr('x', d => xScale(d.data.getMetaValue('revision')))
      .attr('y', () => height)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .merge(rects)
      .transition()
      .duration(150)
      .attr('x', d => xScale(d.data.getMetaValue('revision')))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth());
  }, [data, graphColorScale, height, xScale, yScale]);

  return <g aria-label={`Stacked bar chart for ${activeArtifactNames.join(', ')}`} pointerEvents="all" ref={gRef} />;
};

export default Area;
