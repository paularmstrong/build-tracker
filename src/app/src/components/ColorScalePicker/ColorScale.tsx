/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import RadioSelect from '../RadioSelect';
import React from 'react';
import { ScaleSequential } from 'd3-scale';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  isSelected?: boolean;
  name: string;
  onSelect: (scale: ScaleSequential<string>) => void;
  scale: ScaleSequential<string>;
  style?: StyleProp<ViewStyle>;
}

export const ColorScale = (props: Props): React.ReactElement => {
  const { isSelected, name, onSelect, scale, style } = props;

  const handleSelect = React.useCallback(
    (checked: boolean): void => {
      if (checked) {
        onSelect(scale);
      }
    },
    [onSelect, scale]
  );

  const nativeID = `radio${name.replace(/^\w/g, '')}`;

  return (
    // @ts-ignore
    <View accessibilityRole="label" style={[styles.root, style]}>
      <RadioSelect labelledBy={nativeID} onValueChange={handleSelect} style={styles.radio} value={isSelected} />
      <Text nativeID={nativeID}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    cursor: 'pointer',
    flexDirection: 'row',
    alignItems: 'center'
  },
  radio: {
    marginEnd: Theme.Spacing.Small
  }
});

export default ColorScale;
