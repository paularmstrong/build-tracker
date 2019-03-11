/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { axisLeft } from 'd3-axis';
import { formatBytes } from '@build-tracker/formatting';
import React from 'react';
import { ScaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

interface Props {
  scale: ScaleLinear<number, number>;
}

const tickFormat = (d): string =>
  formatBytes(d.valueOf(), { formatter: (bytes: number, units: number): number => Math.round(bytes / units) });

const YAxis = (props: Props): React.ReactElement => {
  const { scale } = props;
  const ref = React.useRef(null);

  React.useEffect(() => {
    const axis = axisLeft(scale).tickFormat(tickFormat);
    select(ref.current).call(axis);
  }, [scale]);

  return <g ref={ref} />;
};

export default YAxis;
