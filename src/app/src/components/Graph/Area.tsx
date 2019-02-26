/**
 * Copyright (c) 2019 Paul Armstrong
 */
import 'd3-transition';
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import React from 'react';
import { select } from 'd3-selection';
import { area, stack } from 'd3-shape';
import { ScaleLinear, ScalePoint, ScaleSequential } from 'd3-scale';

interface Props {
  activeArtifactNames: Array<string>;
  colorScale: ScaleSequential<string>;
  comparator: Comparator;
  sizeKey: string;
  xScale: ScalePoint<string>;
  yScale: ScaleLinear<number, number>;
}

const Area = (props: Props): React.ReactElement => {
  const { activeArtifactNames, comparator, sizeKey, xScale, yScale } = props;
  const colorScale = props.colorScale.domain([0, comparator.artifactNames.length]);
  const gRef = React.useRef(null);

  const graphColorScale = React.useMemo(() => {
    return d => colorScale(comparator.artifactNames.indexOf(d.key));
  }, [colorScale, comparator.artifactNames]);

  React.useEffect(() => {
    const dataStack = stack();
    dataStack.keys(activeArtifactNames);
    // @ts-ignore
    dataStack.value((build: Build, key) => {
      const artifact = build.getArtifact(key);
      return artifact ? artifact.sizes[sizeKey] : 0;
    });

    // @ts-ignore You can stack any data, as long as you apply the appropriate x/y transforms
    const data = dataStack(comparator.builds);

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
      .style('fill', '#000000')
      // @ts-ignore Docs are very clear that this is allowed
      .merge(artifact)
      .transition()
      .duration(100)
      .style('fill', graphColorScale)
      .attr('d', areaChart);
  });

  return <g aria-label={`Stacked area chart for ${activeArtifactNames.join(', ')}`} ref={gRef} />;
};

export default Area;
