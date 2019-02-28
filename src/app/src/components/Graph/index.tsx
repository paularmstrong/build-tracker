/**
 * Copyright (c) 2019 Paul Armstrong
 */
import 'd3-transition';
import Area from './Area';
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import HoverOverlay from './HoverOverlay';
import { Offset } from './Offset';
import React from 'react';
import { stack } from 'd3-shape';
import XAxis from './XAxis';
import YAxis from './YAxis';
import { createElement, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { scaleLinear, scalePoint, ScaleSequential } from 'd3-scale';

interface Props {
  activeArtifacts: { [key: string]: boolean };
  colorScale: ScaleSequential<string>;
  comparator: Comparator;
  hoveredArtifact: string;
  onHoverArtifact: (artifactName: string) => void;
  onSelectRevision: (revision: string) => void;
  selectedRevisions: Array<string>;
  sizeKey: string;
}

export class SVG extends React.Component<{ height: number; width: number }> {
  public render(): React.ReactElement {
    return createElement('svg', this.props);
  }
}

const Graph = (props: Props): React.ReactElement => {
  const {
    activeArtifacts,
    colorScale,
    comparator,
    hoveredArtifact,
    onHoverArtifact,
    onSelectRevision,
    selectedRevisions,
    sizeKey
  } = props;
  const [{ width, height }, setDimensions] = React.useState({ width: 0, height: 0 });
  const svgRef = React.useRef(null);

  const activeArtifactNames = Object.keys(activeArtifacts).filter(name => activeArtifacts[name]);

  const xScale = React.useMemo(() => {
    const domain = comparator.builds
      .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf())
      .map(build => build.getMetaValue('revision'));
    return scalePoint()
      .range([0, width - Offset.LEFT - Offset.RIGHT])
      .padding(0.05)
      .round(true)
      .domain(domain);
  }, [comparator, width]);

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

  return (
    <View onLayout={handleLayout} style={styles.root}>
      <SVG height={height} ref={svgRef} width={width}>
        <g className="main" transform={`translate(${Offset.LEFT},${Offset.TOP})`}>
          {height && width ? (
            <>
              <XAxis height={height - Offset.TOP - Offset.BOTTOM} scale={xScale} />
              <YAxis scale={yScale} />
              <Area
                activeArtifactNames={activeArtifactNames}
                colorScale={colorScale}
                comparator={comparator}
                data={data}
                hoveredArtifact={hoveredArtifact}
                xScale={xScale}
                yScale={yScale}
              />
              <HoverOverlay
                data={data}
                height={height - Offset.TOP - Offset.BOTTOM}
                onHoverArtifact={onHoverArtifact}
                onSelectRevision={onSelectRevision}
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
