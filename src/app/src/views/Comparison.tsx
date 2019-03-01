/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import BuildInfo from '../components/BuildInfo';
import ComparisonTable from '../components/ComparisonTable';
import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props extends React.ComponentProps<typeof ComparisonTable> {
  focusedRevision: string;
  onUnfocusRevision: () => void;
  style?: StyleProp<ViewStyle>;
}

const Comparison = (props: Props): React.ReactElement => {
  const {
    activeArtifacts,
    colorScale,
    comparator,
    focusedRevision,
    hoveredArtifact,
    onDisableArtifact,
    onEnableArtifact,
    onFocusRevision,
    onHoverArtifact,
    onRemoveRevision,
    onUnfocusRevision,
    sizeKey,
    style
  } = props;
  return (
    <View style={style}>
      <ScrollView horizontal style={styles.tableScroll}>
        <ScrollView>
          <ComparisonTable
            activeArtifacts={activeArtifacts}
            colorScale={colorScale}
            comparator={comparator}
            hoveredArtifact={hoveredArtifact}
            onDisableArtifact={onDisableArtifact}
            onEnableArtifact={onEnableArtifact}
            onFocusRevision={onFocusRevision}
            onHoverArtifact={onHoverArtifact}
            onRemoveRevision={onRemoveRevision}
            sizeKey={sizeKey}
          />
        </ScrollView>
      </ScrollView>
      {focusedRevision ? (
        <React.Suspense fallback={null}>
          <View style={styles.buildInfo} testID="buildinfo">
            <BuildInfo
              build={comparator.builds.find(build => build.getMetaValue('revision') === focusedRevision)}
              onClose={onUnfocusRevision}
            />
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
    animationName: [
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
