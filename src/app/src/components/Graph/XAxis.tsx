/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { axisBottom } from 'd3-axis';
import { formatSha } from '@build-tracker/formatting';
import React from 'react';
import { ScalePoint } from 'd3-scale';
import { select } from 'd3-selection';

interface Props {
  height: number;
  scale: ScalePoint<string>;
}

const MAX_TICK_LABELS = 50;

const XAxis = (props: Props): React.ReactElement => {
  const { height, scale } = props;
  const ref = React.useRef(null);
  const domainLength = scale.domain().length;

  React.useEffect(() => {
    const axis = axisBottom(scale).tickFormat((d, i) => {
      if (domainLength <= MAX_TICK_LABELS || i % Math.floor(domainLength / (MAX_TICK_LABELS / 2)) === 0) {
        return formatSha(d);
      }
      return '';
    });

    select(ref.current)
      .call(axis)
      .selectAll('text')
      .attr('y', 3)
      .attr('x', 6)
      .attr('transform', 'rotate(24)')
      .style('text-anchor', 'start');
  }, [domainLength, scale]);

  return <g ref={ref} transform={`translate(0, ${height})`} />;
};

export default XAxis;
