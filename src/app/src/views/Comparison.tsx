/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import BuildInfo from '../components/BuildInfo';
import ColorScales from '../modules/ColorScale';
import ComparisonTable from '../components/ComparisonTable';
import React from 'react';
import { State } from '../store/types';
import { removeComparedRevision, setArtifactActive, setFocusedRevision, setHoveredArtifacts } from '../store/actions';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useDispatch, useMappedState } from 'redux-react-hook';

interface Props {
  style?: StyleProp<ViewStyle>;
}

interface MappedState {
  activeArtifacts: State['activeArtifacts'];
  colorScaleName: State['colorScale'];
  comparator: State['comparator'];
  disabledArtifactsVisible: boolean;
  focusedRevision: string;
  hoveredArtifacts: Array<string>;
  sizeKey: string;
}

const mapState = (state: State): MappedState => ({
  activeArtifacts: state.activeArtifacts,
  colorScaleName: state.colorScale,
  comparator: state.activeComparator,
  disabledArtifactsVisible: state.disabledArtifactsVisible,
  focusedRevision: state.focusedRevision,
  hoveredArtifacts: state.hoveredArtifacts,
  sizeKey: state.sizeKey
});

const Comparison = (props: Props): React.ReactElement => {
  const { style } = props;

  const {
    activeArtifacts,
    colorScaleName,
    comparator,
    disabledArtifactsVisible,
    focusedRevision,
    hoveredArtifacts,
    sizeKey
  } = useMappedState(mapState);
  const dispatch = useDispatch();

  const colorScale = React.useMemo(() => ColorScales[colorScaleName].domain([0, comparator.artifactNames.length]), [
    colorScaleName,
    comparator.artifactNames.length
  ]);

  const handleDisableArtifacts = React.useCallback(
    (artifactNames: Array<string>): void => {
      dispatch(setArtifactActive(artifactNames, false));
    },
    [dispatch]
  );

  const handleEnableArtifacts = React.useCallback(
    (artifactNames: Array<string>): void => {
      dispatch(setArtifactActive(artifactNames, true));
    },
    [dispatch]
  );

  const handleFocusArtifacts = React.useCallback(
    (artifactNames: Array<string>): void => {
      dispatch(setArtifactActive(artifactNames, true));
      dispatch(setArtifactActive(Object.keys(activeArtifacts).filter(name => !artifactNames.includes(name)), false));
    },
    [activeArtifacts, dispatch]
  );

  const handleFocusRevision = React.useCallback(
    (revision: string): void => {
      dispatch(setFocusedRevision(revision));
    },
    [dispatch]
  );

  const handleRemoveRevision = React.useCallback(
    (revision: string): void => {
      dispatch(removeComparedRevision(revision));
    },
    [dispatch]
  );

  const handleHoverArtifacts = React.useCallback(
    (artifacts: Array<string>): void => {
      dispatch(setHoveredArtifacts(artifacts));
    },
    [dispatch]
  );

  return (
    <View style={style}>
      <ScrollView horizontal style={styles.tableScroll}>
        <ScrollView>
          <ComparisonTable
            activeArtifacts={activeArtifacts}
            colorScale={colorScale}
            comparator={comparator}
            disabledArtifactsVisible={disabledArtifactsVisible}
            hoveredArtifacts={hoveredArtifacts}
            onDisableArtifacts={handleDisableArtifacts}
            onEnableArtifacts={handleEnableArtifacts}
            onFocusArtifacts={handleFocusArtifacts}
            onFocusRevision={handleFocusRevision}
            onHoverArtifacts={handleHoverArtifacts}
            onRemoveRevision={handleRemoveRevision}
            sizeKey={sizeKey}
          />
        </ScrollView>
      </ScrollView>
      {focusedRevision ? (
        <React.Suspense fallback={null}>
          <View style={styles.buildInfo} testID="buildinfo">
            <BuildInfo focusedRevision={focusedRevision} />
          </View>
        </React.Suspense>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  tableScroll: {
    width: '100%',
    transitionProperty: 'height',
    transitionDuration: '0.1s'
  },
  buildInfo: {
    width: '100%',
    borderTopColor: Theme.Color.Gray10,
    borderTopWidth: StyleSheet.hairlineWidth,
    animationDuration: '0.1s',
    animationKeyframes: [
      {
        '0%': { transform: [{ translateY: '100%' }] },
        '100%': { transform: [{ translateY: '0%' }] }
      }
    ],
    animationTimingFunction: 'ease-out',
    animationIterationCount: 1
  }
});

export default Comparison;
