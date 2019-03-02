/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import AppBar from '../components/AppBar';
import Build from '@build-tracker/build';
import buildDataA from '@build-tracker/fixtures/builds/30af629d1d4c9f2f199cec5f572a019d4198004c.json';
import buildDataB from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import buildDataC from '@build-tracker/fixtures/builds/243024909db66ac3c3e48d2ffe4015f049609834.json';
import buildDataD from '@build-tracker/fixtures/builds/19868a0432f039d45783bca1845cede313fbfbe1.json';
import buildDataE from '@build-tracker/fixtures/builds/4a8882483a664401a602f64a882d0ed7fb1763cb.json';
import ColorScale from '../modules/ColorScale';
import Comparator from '@build-tracker/comparator';
import Drawer from '../components/Drawer';
import DrawerView from '../views/Drawer';
import Graph from '../components/Graph';
import MenuIcon from '../icons/Menu';
import React from 'react';
import { ScaleSequential } from 'd3-scale';
import { StyleSheet, View } from 'react-native';

const Comparison = React.lazy(() => import(/* webpackChunkName: "Comparison" */ '../views/Comparison'));

const builds = [
  new Build(buildDataA.meta, buildDataA.artifacts),
  new Build(buildDataB.meta, buildDataB.artifacts),
  new Build(buildDataC.meta, buildDataC.artifacts),
  new Build(buildDataD.meta, buildDataD.artifacts),
  new Build(buildDataE.meta, buildDataE.artifacts)
];

const Main = (): React.ReactElement => {
  const drawerRef: React.RefObject<Drawer> = React.useRef(null);
  const [compareRevisions, setCompareRevisions] = React.useState<Array<string>>([]);
  const comparator = React.useMemo((): Comparator => new Comparator({ builds }), []);
  const activeComparator = React.useMemo(
    (): Comparator =>
      new Comparator({
        builds: builds.filter(build => compareRevisions.indexOf(build.getMetaValue('revision')) !== -1)
      }),
    [compareRevisions]
  );

  const [colorScale, setColorScale] = React.useState<ScaleSequential<string>>(() => ColorScale.Rainbow);
  const [sizeKey, setSizeKey] = React.useState<string>(comparator.sizeKeys[0]);
  const [focusedRevision, setFocusedRevision] = React.useState<string>(null);
  const [hoveredArtifact, setHoveredArtifact] = React.useState<string>(null);
  const [activeArtifacts, setActiveArtifacts] = React.useState<{ [key: string]: boolean }>(
    comparator.artifactNames.reduce((memo: { [key: string]: boolean }, name: string) => {
      memo[name] = true;
      return memo;
    }, {})
  );
  const [, forceUpdate] = React.useState(0);

  const showDrawer = React.useCallback((): void => {
    drawerRef.current && drawerRef.current.show();
  }, []);

  const handleSelectColorScale = React.useCallback((scale): void => {
    setColorScale(() => scale);
  }, []);

  const handleDisableArtifact = React.useCallback(
    (name: string): void => {
      if (name === 'All') {
        Object.keys(activeArtifacts).forEach(name => {
          activeArtifacts[name] = false;
        });
      } else {
        activeArtifacts[name] = false;
      }
      setActiveArtifacts(activeArtifacts);
      forceUpdate(Date.now());
    },
    [activeArtifacts]
  );

  const handleEnableArtifact = React.useCallback(
    (name: string): void => {
      if (name === 'All') {
        Object.keys(activeArtifacts).forEach(name => {
          activeArtifacts[name] = true;
        });
      } else {
        activeArtifacts[name] = true;
      }
      setActiveArtifacts(activeArtifacts);
      forceUpdate(Date.now());
    },
    [activeArtifacts]
  );

  const handleSelectSizeKey = React.useCallback(
    (name: string): void => {
      setSizeKey(name);
      forceUpdate(Date.now());
    },
    [setSizeKey]
  );

  const handleSelectRevision = React.useCallback(
    (revision: string): void => {
      setCompareRevisions([...compareRevisions, revision]);
    },
    [compareRevisions, setCompareRevisions]
  );

  const handleUnfocusRevision = React.useCallback((): void => {
    setFocusedRevision(null);
  }, [setFocusedRevision]);

  const handleRemoveRevision = React.useCallback(
    (revision: string): void => {
      if (focusedRevision === revision) {
        setFocusedRevision(null);
      }
      setCompareRevisions(compareRevisions.filter(r => r !== revision));
    },
    [compareRevisions, focusedRevision, setCompareRevisions]
  );

  return (
    <View style={styles.layout}>
      <DrawerView
        colorScale={colorScale}
        comparator={comparator}
        onSelectColorScale={handleSelectColorScale}
        onSelectSizeKey={handleSelectSizeKey}
        ref={drawerRef}
        sizeKey={sizeKey}
      />
      <View
        // @ts-ignore
        accessibilityRole="main"
        style={styles.main}
      >
        <View style={[styles.column, styles.chart]}>
          <AppBar navigationIcon={MenuIcon} onPressNavigationIcon={showDrawer} title="Build Tracker" />
          <Graph
            activeArtifacts={activeArtifacts}
            colorScale={colorScale}
            comparator={comparator}
            hoveredArtifact={hoveredArtifact}
            onHoverArtifact={setHoveredArtifact}
            onSelectRevision={handleSelectRevision}
            selectedRevisions={compareRevisions}
            sizeKey={sizeKey}
          />
        </View>
        {compareRevisions.length ? (
          <React.Suspense fallback={null}>
            <Comparison
              activeArtifacts={activeArtifacts}
              colorScale={colorScale}
              comparator={activeComparator}
              focusedRevision={focusedRevision}
              hoveredArtifact={hoveredArtifact}
              onDisableArtifact={handleDisableArtifact}
              onEnableArtifact={handleEnableArtifact}
              onFocusRevision={setFocusedRevision}
              onUnfocusRevision={handleUnfocusRevision}
              onHoverArtifact={setHoveredArtifact}
              onRemoveRevision={handleRemoveRevision}
              sizeKey={sizeKey}
              style={[styles.column, styles.table]}
            />
          </React.Suspense>
        ) : null}
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
  }
});

export default Main;
