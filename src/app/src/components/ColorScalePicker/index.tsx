/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import ColorScale from './ColorScale';
import ColorScales from '../../modules/ColorScale';
import React from 'react';
import { ScaleSequential } from 'd3-scale';
import { State } from '../../store/types';
import { useMappedState } from 'redux-react-hook';
import { StyleSheet, View } from 'react-native';

const mapState = (state: State): { activeColorScale: ScaleSequential<string> } => ({
  activeColorScale: ColorScales[state.colorScale]
});

export const ColorScalePicker = (): React.ReactElement => {
  const { activeColorScale } = useMappedState(mapState);
  return (
    <View style={styles.root}>
      {Object.entries(ColorScales).map(([name, scale]) => {
        return <ColorScale isSelected={activeColorScale === scale} key={name} name={name} style={styles.scale} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column'
  },
  scale: {
    marginBottom: Theme.Spacing.Small
  }
});

export default React.memo(ColorScalePicker);
