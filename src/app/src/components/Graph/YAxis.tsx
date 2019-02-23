import { axisLeft } from 'd3-axis';
import { formatBytes } from '@build-tracker/formatting';
import React from 'react';
import { ScaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

interface Props {
  height: number;
  scale: ScaleLinear<number, number>;
}

const YAxis = (props: Props): React.ReactElement => {
  const { height, scale } = props;
  const gRef = React.useRef(null);

  React.useEffect(() => {
    if (!gRef.current || !height) {
      return;
    }

    const axis = axisLeft(scale).tickFormat(d => formatBytes(d.valueOf()));
    select(gRef.current).call(axis);
  });

  return <g ref={gRef} />;
};

export default YAxis;
