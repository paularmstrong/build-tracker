/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import ColorScale from './ColorScale';
import ColorScales from '../../modules/ColorScale';
import React from 'react';
import { State } from '../../store/types';
import { useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';

export const ColorScalePicker = (): React.ReactElement => {
  const activeColorScale = useSelector((state: State) => ColorScales[state.colorScale]);
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
