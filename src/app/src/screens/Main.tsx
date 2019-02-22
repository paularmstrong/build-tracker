import * as Theme from '../theme';
import AppBar from '../components/AppBar';
import Comparator from '@build-tracker/comparator';
import ComparisonTable from '../components/ComparisonTable';
import Drawer from '../components/Drawer';
import Graph from '../components/Graph';
import { interpolateRainbow } from 'd3-scale-chromatic';
import MenuIcon from '../icons/Menu';
import React from 'react';
import { scaleSequential, ScaleSequential } from 'd3-scale';
import Subtitle from '../components/Subtitle';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Build from '@build-tracker/build';
import buildDataA from '@build-tracker/fixtures/builds/30af629d1d4c9f2f199cec5f572a019d4198004c.json';
import buildDataB from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import buildDataC from '@build-tracker/fixtures/builds/243024909db66ac3c3e48d2ffe4015f049609834.json';

const builds = [
  new Build(buildDataA.meta, buildDataA.artifacts),
  new Build(buildDataB.meta, buildDataB.artifacts),
  new Build(buildDataC.meta, buildDataC.artifacts)
];

const Main = (): React.ReactElement => {
  const drawerRef: React.RefObject<Drawer> = React.useRef(null);

  const showDrawer = (): void => {
    drawerRef.current && drawerRef.current.show();
  };

  const comparator = React.useMemo((): Comparator => new Comparator({ builds }), [builds]);

  const colorScale = React.useMemo(
    (): ScaleSequential<string> => scaleSequential(interpolateRainbow).domain([0, comparator.artifactNames.length]),
    [comparator.artifactNames.length]
  );

  return (
    <View style={styles.layout}>
      <Drawer hidden ref={drawerRef}>
        <Subtitle title="Build Tracker" />
      </Drawer>
      <View
        // @ts-ignore
        accessibilityRole="main"
        style={styles.main}
      >
        <View style={[styles.column, styles.chart]}>
          <AppBar navigationIcon={MenuIcon} onPressNavigationIcon={showDrawer} title="Build Tracker" />
          <Graph colorScale={colorScale} comparator={comparator} sizeKey="gzip" />
        </View>
        <View key="table" style={[styles.column, styles.table]}>
          <ScrollView horizontal style={styles.tableScroll}>
            <ScrollView>
              <ComparisonTable comparator={comparator} sizeKey="gzip" />
            </ScrollView>
          </ScrollView>
          <View style={styles.buildInfo}>
            <Text>Placeholder: Build Info</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    height: '100vh',
    overflow: 'hidden'
  },
  main: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: '100vh',
    width: '100vw'
  },
  column: {
    flexGrow: 3,
    flexShrink: 1,
    height: '100vh',
    alignItems: 'flex-start'
  },
  chart: {
    flexDirection: 'column'
  },
  table: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    maxWidth: '40vw',
    borderLeftColor: Theme.Color.Gray10,
    borderLeftWidth: StyleSheet.hairlineWidth
  },
  tableScroll: {
    width: '100%'
  },
  buildInfo: {
    width: '100%',
    borderTopColor: Theme.Color.Gray10,
    borderTopWidth: StyleSheet.hairlineWidth
  }
});

export default Main;
