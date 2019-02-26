/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import React from 'react';
import { ScalePoint } from 'd3-scale';
import { select } from 'd3-selection';

interface Props {
  height: number;
  onSelectRevision: (revision: string) => void;
  selectedRevisions: Array<string>;
  width: number;
  xScale: ScalePoint<string>;
}

const HoverOverlay = (props: Props): React.ReactElement => {
  const { height, onSelectRevision, selectedRevisions, width, xScale } = props;
  const lineRef = React.useRef(null);
  const domain = xScale.domain();

  const buildRevisionFromX = (x: number): string => {
    return domain.reduce((prev, curr) => {
      return Math.abs(xScale(curr) - x + 80) > Math.abs(xScale(prev) - x + 80) ? prev : curr;
    }, domain[0]);
  };

  // TODO: handle clicks on revisions
  const handleClick = React.useCallback(
    (event: React.MouseEvent<SVGRectElement>): void => {
      const {
        nativeEvent: { offsetX }
      } = event;

      const revision = buildRevisionFromX(offsetX);
      if (selectedRevisions.indexOf(revision) !== -1) {
        return;
      }

      // @ts-ignore TODO make clicking do things
      onSelectRevision(revision);
    },
    [buildRevisionFromX, onSelectRevision, selectedRevisions]
  );

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
        data-testid="hoveroverlay"
        height={height}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        pointerEvents="all"
        style={styles.rect}
        width={width}
      />
      {selectedRevisions.map(revision => {
        const x = xScale(revision);
        return (
          <line
            data-testid="selectedline"
            key={revision}
            x1={x}
            x2={x}
            y1={0}
            y2={height}
            style={styles.selectedLine}
          />
        );
      })}
      <line data-testid="hoverline" ref={lineRef} style={styles.hoverLine} />
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
  },
  selectedLine: {
    stroke: Theme.Color.White,
    fill: 'none',
    strokeWidth: '1px',
    strokeDasharray: '2 2'
  }
};

export default HoverOverlay;
