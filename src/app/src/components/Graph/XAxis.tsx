import { axisBottom } from 'd3-axis';
import { formatSha } from '@build-tracker/formatting';
import React from 'react';
import { ScalePoint } from 'd3-scale';
import { select } from 'd3-selection';

interface Props {
  height: number;
  scale: ScalePoint<string>;
}

const XAxis = (props: Props): React.ReactElement => {
  const { height, scale } = props;
  const gRef = React.useRef(null);

  React.useEffect(() => {
    if (!gRef.current || !height) {
      return;
    }

    const axis = axisBottom(scale).tickFormat(d => formatSha(d));
    select(gRef.current)
      .call(axis)
      .attr('transform', `translate(0, ${height - 100})`)
      .selectAll('text')
      .attr('y', 3)
      .attr('x', 6)
      .attr('transform', 'rotate(24)')
      .style('text-anchor', 'start');
  });

  return <g ref={gRef} />;
};

export default XAxis;
