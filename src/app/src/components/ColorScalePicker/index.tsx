/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import ColorScale from './ColorScale';
import ColorScales from '../../modules/ColorScale';
import React from 'react';
import { ScaleSequential } from 'd3-scale';
import { StyleSheet, View } from 'react-native';

interface Props {
  activeColorScale: ScaleSequential<string>;
  onSelect: (scale: ScaleSequential<string>) => void;
}

export const ColorScalePicker = (props: Props): React.ReactElement => {
  const { activeColorScale, onSelect } = props;
  return (
    <View style={styles.root}>
      {Object.entries(ColorScales).map(([name, scale]) => {
        return (
          <ColorScale
            isSelected={activeColorScale === scale}
            key={name}
            name={name}
            onSelect={onSelect}
            scale={scale}
            style={styles.scale}
          />
        );
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
