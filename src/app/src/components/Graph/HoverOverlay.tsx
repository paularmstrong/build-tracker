/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import Build from '@build-tracker/build';
import { formatSha } from '@build-tracker/formatting';
import memoize from 'memoize-one';
import { Offset } from './Offset';
import React from 'react';
import { select } from 'd3-selection';
import { Series } from 'd3-shape';
import Tooltip from '../Tooltip';
import { ScaleBand, ScaleLinear, ScalePoint } from 'd3-scale';

interface Props {
  data: Array<Series<Build, string>>;
  height: number;
  onHoverArtifacts: (artifactNames: Array<string>) => void;
  onSelectRevision: (revision: string) => void;
  selectedRevisions: Array<string>;
  width: number;
  xScale: ScalePoint<string> | ScaleBand<string>;
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

  const xGetter = React.useMemo(
    () => (revision: string): number => {
      return xScale.bandwidth ? xScale(revision) + xScale.bandwidth() / 2 : xScale(revision);
    },
    [xScale]
  );

  const buildRevisionFromX = React.useCallback(
    (x: number): { index: number; value: string } => {
      return domain.reduce(
        (prev, curr, index) => {
          const isPrev = Math.abs(xGetter(curr) - x) > Math.abs(xGetter(prev.value) - x);
          return {
            index: isPrev ? prev.index : index,
            value: isPrev ? prev.value : curr
          };
        },
        { index: 0, value: domain[0] }
      );
    },
    [domain, xGetter]
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

  const [offsetX, setOffsetX] = React.useState(NaN);
  const [absPosition, setAbsPosition] = React.useState({ left: 0, top: 0 });
  const [hoveredArtifact, setHoveredArtifact] = React.useState('');

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<SVGRectElement>): void => {
      const {
        nativeEvent: { offsetX, offsetY = Offset.TOP, pageX, pageY }
      } = event;

      setOffsetX(offsetX);
      setAbsPosition({ left: pageX, top: pageY });

      const revision = buildRevisionFromX(offsetX - Offset.LEFT);
      const xPos = xGetter(revision.value);
      handleMoveLine(lineRef.current, xPos);

      const yValue = yScale.invert(offsetY - Offset.TOP);
      const hoveredArtifact = data.find(data => {
        return data[revision.index][0] <= yValue && data[revision.index][1] >= yValue;
      });
      hoveredArtifact && setHoveredArtifact(hoveredArtifact.key);
      onHoverArtifacts(hoveredArtifact ? [hoveredArtifact.key] : []);
    },
    [buildRevisionFromX, data, onHoverArtifacts, xGetter, yScale]
  );

  const handleMouseOut = React.useCallback((): void => {
    select(lineRef.current).style('opacity', 0);
    onHoverArtifacts([]);
    setOffsetX(NaN);
  }, [onHoverArtifacts]);

  const handleMouseOver = React.useCallback((): void => {
    select(lineRef.current).style('opacity', 1);
  }, []);

  const getTooltipText = React.useCallback((): string => {
    const revision = buildRevisionFromX(offsetX - Offset.LEFT);
    return `Revision: ${formatSha(revision.value)}, Artifact: ${hoveredArtifact}`;
  }, [buildRevisionFromX, hoveredArtifact, offsetX]);

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
        const x = xGetter(revision);
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
      {!isNaN(offsetX) ? <Tooltip left={absPosition.left} top={absPosition.top} text={getTooltipText()} /> : null}
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
