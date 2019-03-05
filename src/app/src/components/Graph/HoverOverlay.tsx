/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import Build from '@build-tracker/build';
import memoize from 'memoize-one';
import { Offset } from './Offset';
import React from 'react';
import { select } from 'd3-selection';
import { Series } from 'd3-shape';
import { ScaleLinear, ScalePoint } from 'd3-scale';

interface Props {
  data: Array<Series<Build, string>>;
  height: number;
  onHoverArtifacts: (artifactNames: Array<string>) => void;
  onSelectRevision: (revision: string) => void;
  selectedRevisions: Array<string>;
  width: number;
  xScale: ScalePoint<string>;
  yScale: ScaleLinear<number, number>;
}

const handleMoveLine = memoize(
  (line, xPos): void => {
    select(line)
      .transition()
      .duration(250)
      .attr('x1', xPos)
      .attr('x2', xPos);
  }
);

const HoverOverlay = (props: Props): React.ReactElement => {
  const { data, height, onHoverArtifacts, onSelectRevision, selectedRevisions, width, xScale, yScale } = props;
  const lineRef = React.useRef(null);
  const domain = xScale.domain();

  const buildRevisionFromX = React.useCallback(
    (x: number): { index: number; value: string } => {
      return domain.reduce(
        (prev, curr, index) => {
          const isPrev = Math.abs(xScale(curr) - x) > Math.abs(xScale(prev.value) - x);
          return {
            index: isPrev ? prev.index : index,
            value: isPrev ? prev.value : curr
          };
        },
        { index: 0, value: domain[0] }
      );
    },
    [domain, xScale]
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<SVGRectElement>): void => {
      const {
        nativeEvent: { offsetX }
      } = event;

      const revision = buildRevisionFromX(offsetX - Offset.LEFT);
      if (selectedRevisions.indexOf(revision.value) !== -1) {
        return;
      }

      onSelectRevision(revision.value);
    },
    [buildRevisionFromX, onSelectRevision, selectedRevisions]
  );

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<SVGRectElement>): void => {
      const {
        nativeEvent: { offsetX, offsetY = Offset.TOP }
      } = event;

      const revision = buildRevisionFromX(offsetX - Offset.LEFT);
      const xPos = xScale(revision.value);
      handleMoveLine(lineRef.current, xPos);

      const yValue = yScale.invert(offsetY - Offset.TOP);
      const hoveredArtifact = data.find(data => {
        return data[revision.index][0] <= yValue && data[revision.index][1] >= yValue;
      });
      onHoverArtifacts(hoveredArtifact ? [hoveredArtifact.key] : []);
    },
    [buildRevisionFromX, data, onHoverArtifacts, xScale, yScale]
  );

  const handleMouseOut = React.useCallback((): void => {
    select(lineRef.current).style('opacity', 0);
    onHoverArtifacts([]);
  }, [onHoverArtifacts]);

  const handleMouseOver = React.useCallback((): void => {
    select(lineRef.current).style('opacity', 1);
  }, []);

  return (
    <g>
      <rect
        data-testid="hoveroverlay"
        height={height}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        pointerEvents="fill"
        style={styles.rect}
        width={width}
      />
      {selectedRevisions.map(revision => {
        const x = xScale(revision);
        return (
          <line
            data-testid="selectedline"
            key={revision}
            pointerEvents="none"
            x1={x}
            x2={x}
            y1={0}
            y2={height}
            style={styles.selectedLine}
          />
        );
      })}
      <line data-testid="hoverline" pointerEvents="none" ref={lineRef} style={styles.hoverLine} y1={0} y2={height} />
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
