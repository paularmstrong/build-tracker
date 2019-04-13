/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import AppBarView from '../views/AppBar';
import Build from '@build-tracker/build';
import Drawer from '../components/Drawer';
import DrawerView from '../views/Drawer';
import { fetch } from 'cross-fetch';
import Graph from '../views/Graph';
import React from 'react';
import { setBuilds } from '../store/actions';
import Snacks from '../views/Snacks';
import { State } from '../store/types';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch, useMappedState } from 'redux-react-hook';

const Comparison = React.lazy(() => import(/* webpackChunkName: "Comparison" */ '../views/Comparison'));

interface MappedState {
  buildsCount: number;
  dateRange: { start: Date; end: Date };
  showComparisonTable: boolean;
  url: string;
}

const mapState = (state: State): MappedState => ({
  buildsCount: state.builds.length,
  dateRange: state.dateRange,
  showComparisonTable: !!state.comparedRevisions.length,
  url: state.url
});

const dateToSeconds = (date: Date): number => Math.round(date.valueOf() / 1000);

enum FetchState {
  NONE,
  FETCHING,
  FETCHED,
  ERROR
}

const Main = (): React.ReactElement => {
  const drawerRef: React.RefObject<Drawer> = React.useRef(null);

  const { buildsCount, dateRange, showComparisonTable, url } = useMappedState(mapState);
  const [fetchState, setFetchState] = React.useState<FetchState>(FetchState.NONE);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setFetchState(FetchState.FETCHING);
    if (dateRange) {
      fetch(`${url}/api/builds/time/${dateToSeconds(dateRange.start)}...${dateToSeconds(dateRange.end)}`)
        .then(response => response.json())
        .then(builds => {
          dispatch(setBuilds(builds.map(buildStruct => new Build(buildStruct.meta, buildStruct.artifacts))));
        })
        .then(() => {
          setFetchState(FetchState.FETCHED);
        })
        .catch(() => {
          setFetchState(FetchState.ERROR);
        });
      return;
    }
    if (buildsCount === 0) {
      fetch(`${url}/api/builds`)
        .then(response => response.json())
        .then(builds => {
          dispatch(setBuilds(builds.map(buildStruct => new Build(buildStruct.meta, buildStruct.artifacts))));
        })
        .then(() => {
          setFetchState(FetchState.FETCHED);
        })
        .catch(() => {
          setFetchState(FetchState.ERROR);
        });
    }
  }, [buildsCount, dateRange, dispatch, url]);

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
