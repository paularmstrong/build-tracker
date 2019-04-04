/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import AppBarView from '../views/AppBar';
import Build from '@build-tracker/build';
import Drawer from '../components/Drawer';
import DrawerView from '../views/Drawer';
import { fetch } from 'cross-fetch';
import Graph from '../components/Graph';
import React from 'react';
import { setBuilds } from '../store/actions';
import Snacks from '../views/Snacks';
import { State } from '../store/types';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useMappedState } from 'redux-react-hook';

const Comparison = React.lazy(() => import(/* webpackChunkName: "Comparison" */ '../views/Comparison'));

interface MappedState {
  buildsCount: number;
  showComparisonTable: boolean;
  url: string;
}

const mapState = (state: State): MappedState => ({
  buildsCount: state.builds.length,
  showComparisonTable: !!state.comparedRevisions.length,
  url: state.url
});

const Main = (): React.ReactElement => {
  const drawerRef: React.RefObject<Drawer> = React.useRef(null);

  const { buildsCount, showComparisonTable, url } = useMappedState(mapState);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (buildsCount === 0) {
      fetch(`${url}/api/builds`)
        .then(response => response.json())
        .then(builds => {
          dispatch(setBuilds(builds.map(buildStruct => new Build(buildStruct.meta, buildStruct.artifacts))));
        });
    }
  }, [buildsCount, dispatch, url]);

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
          <Graph />
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
