/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import AppBarView from '../views/AppBar';
import { Handles as DrawerHandles } from '../components/Drawer';
import DrawerView from '../views/Drawer';
import Graph from '../views/Graph';
import React from 'react';
import Snacks from '../views/Snacks';
import { useSelector } from 'react-redux';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { FetchState, State } from '../store/types';

const Comparison = React.lazy(() => import(/* webpackChunkName: "Comparison" */ '../views/Comparison'));

const Main = (): React.ReactElement => {
  const drawerRef = React.useRef<DrawerHandles>(null);

  const showComparisonTable = useSelector(
    (state: State) => !!state.comparedRevisions.length && !!state.activeComparator
  );
  const fetchState = useSelector((state: State) => state.fetchState);

  return (
    <View style={styles.layout}>
      <DrawerView ref={drawerRef} />
      <View
        // @ts-ignore
        accessibilityRole="main"
        style={styles.main}
      >
        <View style={[styles.column, styles.chart]}>
          <AppBarView drawerRef={drawerRef} />
          {fetchState == FetchState.FETCHED ? (
            <Graph />
          ) : fetchState == FetchState.FETCHING ? (
            <View style={styles.loading}>
              <ActivityIndicator accessibilityLabel="Loading builds…" color={Theme.Color.Secondary30} size={'large'} />
            </View>
          ) : null}
        </View>
        <Snacks />
        {showComparisonTable ? (
          <React.Suspense fallback={null}>
            <Comparison style={[styles.column, styles.table]} />
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
  loading: {
    flexGrow: 1,
    alignSelf: 'center',
    justifyContent: 'center'
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
