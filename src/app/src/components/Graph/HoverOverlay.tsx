import * as Theme from '../../theme';
import React from 'react';
import { ScalePoint } from 'd3-scale';
import { select } from 'd3-selection';

interface Props {
  height: number;
  width: number;
  xScale: ScalePoint<string>;
}

const HoverOverlay = (props: Props): React.ReactElement => {
  const { height, width, xScale } = props;
  const lineRef = React.useRef(null);
  const domain = xScale.domain();

  const buildRevisionFromX = (x: number): string => {
    return domain.reduce((prev, curr) => {
      return Math.abs(xScale(curr) - x + 80) > Math.abs(xScale(prev) - x + 80) ? prev : curr;
    }, domain[0]);
  };

  // TODO: handle clicks on revisions
  // const handleClick = (event: React.MouseEvent<SVGRectElement>): void => {
  //   const {
  //     nativeEvent: { offsetX }
  //   } = event;

  //   const xValue = buildRevisionFromX(offsetX);

  //   // @ts-ignore TODO make clicking do things
  //   console.log('clicked', xValue);
  // };

  const handleMouseMove = (event: React.MouseEvent<SVGRectElement>): void => {
    const {
      nativeEvent: { offsetX }
    } = event;

    const xValue = buildRevisionFromX(offsetX);

    select(lineRef.current)
      .attr('x1', xScale(xValue))
      .attr('x2', xScale(xValue))
      .attr('y1', 0)
      .attr('y2', height);
  };

  const handleMouseOut = (): void => {
    select(lineRef.current).style('opacity', 0);
  };

  const handleMouseOver = (): void => {
    select(lineRef.current).style('opacity', 1);
  };

  return (
    <g>
      <rect
        height={height}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        pointerEvents="all"
        style={styles.rect}
        width={width}
      />
      <line ref={lineRef} style={styles.hoverLine} />
    </g>
  );
};

const styles = {
  rect: { fill: 'none' },
  hoverLine: {
    stroke: Theme.Color.White,
    fill: 'none',
    strokeWidth: '3px',
    strokeDasharray: '5 3',
    opacity: 0
  }
};

export default HoverOverlay;
