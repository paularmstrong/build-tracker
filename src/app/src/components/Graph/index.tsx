/**
 * Copyright (c) 2019 Paul Armstrong
 */
import 'd3-transition';
import Area from './Area';
import Build from '@build-tracker/build';
import ColorScales from '../../modules/ColorScale';
import HoverOverlay from './HoverOverlay';
import { Offset } from './Offset';
import React from 'react';
import { stack } from 'd3-shape';
import StackedBar from './StackedBar';
import XAxis from './XAxis';
import YAxis from './YAxis';
import { addComparedRevision, setHoveredArtifacts } from '../../store/actions';
import { createElement, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { GraphType, State } from '../../store/types';
import { scaleBand, scaleLinear, scalePoint } from 'd3-scale';
import { useDispatch, useSelector } from 'react-redux';

export class SVG extends React.Component<{ height: number; width: number }> {
  public render(): React.ReactElement {
    return createElement('svg', this.props);
  }
}

interface Props {
  comparator: State['comparator'];
}

const Graph = (props: Props): React.ReactElement => {
  const { comparator } = props;
  const activeArtifacts = useSelector((state: State) => state.activeArtifacts);
  const colorScale = useSelector((state: State) =>
    ColorScales[state.colorScale].domain([0, state.comparator.artifactNames.length])
  );
  const graphType = useSelector((state: State) => state.graphType);
  const hoveredArtifacts = useSelector((state: State) => state.hoveredArtifacts);
  const selectedRevisions = useSelector((state: State) => state.comparedRevisions);
  const sizeKey = useSelector((state: State) => state.sizeKey);
  const dispatch = useDispatch();

  const [{ width, height }, setDimensions] = React.useState({ width: 0, height: 0 });
  const svgRef = React.useRef(null);

  const activeArtifactNames = React.useMemo(() => {
    return Object.keys(activeArtifacts).filter(name => activeArtifacts[name]);
  }, [activeArtifacts]);

  const xScale = React.useMemo(() => {
    const domain = comparator.builds
      .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf())
      .map(build => build.getMetaValue('revision'));

    return graphType === GraphType.AREA
      ? scalePoint()
          .range([0, width - Offset.LEFT - Offset.RIGHT])
          .padding(0.05)
          .round(true)
          .domain(domain)
      : scaleBand()
          .rangeRound([0, width - Offset.LEFT - Offset.RIGHT])
          .padding(0.05)
          .domain(domain);
  }, [comparator, graphType, width]);

  const yScale = React.useMemo(() => {
    const totals = comparator.builds.map(build => build.getSum(activeArtifactNames)[sizeKey]);
    const maxTotal = Math.max(...totals);
    return scaleLinear()
      .range([height - Offset.TOP - Offset.BOTTOM, 0])
      .domain([0, maxTotal]);
  }, [activeArtifactNames, comparator, height, sizeKey]);

  const data = React.useMemo(() => {
    const dataStack = stack<Build, string>();
    dataStack.keys(activeArtifactNames);
    dataStack.value((build: Build, key) => {
      const artifact = build.getArtifact(key);
      return artifact ? artifact.sizes[sizeKey] : 0;
    });

    return dataStack(comparator.builds);
  }, [activeArtifactNames, comparator, sizeKey]);

  const handleLayout = (event: LayoutChangeEvent): void => {
    const {
      nativeEvent: {
        layout: { height, width }
      }
    } = event;
    setDimensions({ height, width });
  };

  const handleHoverArtifacts = React.useCallback(
    (artifacts: Array<string>): void => {
      dispatch(setHoveredArtifacts(artifacts));
    },
    [dispatch]
  );

  const handleSelectRevision = React.useCallback(
    (revision: string): void => {
      dispatch(addComparedRevision(revision));
    },
    [dispatch]
  );

  return (
    <View onLayout={handleLayout} style={styles.root}>
      <SVG height={height} ref={svgRef} width={width}>
        <g className="main" transform={`translate(${Offset.LEFT},${Offset.TOP})`}>
          {height && width ? (
            <>
              <XAxis height={height - Offset.TOP - Offset.BOTTOM} scale={xScale} />
              <YAxis scale={yScale} />
              {graphType === GraphType.AREA ? (
                <Area
                  activeArtifactNames={activeArtifactNames}
                  artifactNames={comparator.artifactNames}
                  colorScale={colorScale}
                  data={data}
                  hoveredArtifacts={hoveredArtifacts}
                  xScale={xScale}
                  yScale={yScale}
                />
              ) : (
                <StackedBar
                  activeArtifactNames={activeArtifactNames}
                  artifactNames={comparator.artifactNames}
                  colorScale={colorScale}
                  data={data}
                  height={height}
                  hoveredArtifacts={hoveredArtifacts}
                  // @ts-ignore
                  xScale={xScale}
                  yScale={yScale}
                />
              )}

              <HoverOverlay
                data={data}
                height={height - Offset.TOP - Offset.BOTTOM}
                onHoverArtifacts={handleHoverArtifacts}
                onSelectRevision={handleSelectRevision}
                selectedRevisions={selectedRevisions}
                width={width - Offset.LEFT - Offset.RIGHT}
                xScale={xScale}
                yScale={yScale}
              />
            </>
          ) : null}
        </g>
      </SVG>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    width: '100%',
    maxHeight: 'calc(100% - 4rem)',
    overflow: 'hidden'
  }
});

export default Graph;
