/**
 * Copyright (c) 2019 Paul Armstrong
 */
import 'd3-transition';
import Area from './Area';
import Comparator from '@build-tracker/comparator';
import HoverOverlay from './HoverOverlay';
import React from 'react';
import XAxis from './XAxis';
import YAxis from './YAxis';
import { createElement, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { scaleLinear, scalePoint, ScaleSequential } from 'd3-scale';

interface Props {
  activeArtifacts: { [key: string]: boolean };
  colorScale: ScaleSequential<string>;
  comparator: Comparator;
  sizeKey: string;
}

enum Margin {
  TOP = 0,
  RIGHT = 20,
  BOTTOM = 100,
  LEFT = 80
}

export class SVG extends React.Component<{ height: number; width: number }> {
  public render(): React.ReactElement {
    return createElement('svg', this.props);
  }
}

const Graph = (props: Props): React.ReactElement => {
  const { activeArtifacts, colorScale, comparator, sizeKey } = props;
  const [{ width, height }, setDimensions] = React.useState({ width: 0, height: 0 });
  const svgRef = React.useRef(null);

  const activeArtifactNames = Object.keys(activeArtifacts).filter(name => activeArtifacts[name]);

  const xScale = React.useMemo(() => {
    const domain = comparator.builds
      .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf())
      .map(build => build.getMetaValue('revision'));
    return scalePoint()
      .range([0, width - Margin.LEFT - Margin.RIGHT])
      .padding(0.05)
      .round(true)
      .domain(domain);
  }, [comparator, width]);

  const yScale = React.useMemo(() => {
    const totals = comparator.builds.map(build => build.getSum(activeArtifactNames)[sizeKey]);
    const maxTotal = Math.max(...totals);
    return scaleLinear()
      .range([height - Margin.TOP - Margin.BOTTOM, 0])
      .domain([0, maxTotal]);
  }, [activeArtifactNames, comparator, height, sizeKey]);

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
        <g className="main" transform="translate(80,20)">
          {height && width ? (
            <>
              <XAxis height={height - Margin.TOP - Margin.BOTTOM} scale={xScale} />
              <YAxis scale={yScale} />
              <Area
                activeArtifactNames={activeArtifactNames}
                colorScale={colorScale}
                comparator={comparator}
                sizeKey={sizeKey}
                xScale={xScale}
                yScale={yScale}
              />
              <HoverOverlay
                height={height - Margin.TOP - Margin.BOTTOM}
                width={width - Margin.LEFT - Margin.RIGHT}
                xScale={xScale}
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
