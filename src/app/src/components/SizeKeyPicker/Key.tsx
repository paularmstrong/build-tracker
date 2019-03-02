/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import RadioSelect from '../RadioSelect';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  isSelected?: boolean;
  onSelect: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  value: string;
}

const SizeKeyPicker = (props: Props): React.ReactElement => {
  const { isSelected, onSelect, style, value } = props;

  const handleSelect = React.useCallback(
    (checked: boolean): void => {
      if (checked) {
        onSelect(value);
      }
    },
    [onSelect, value]
  );

  const nativeID = `radio${value.replace(/^\w/g, '')}`;

  return (
    // @ts-ignore
    <View accessibilityRole="label" style={[styles.root, style]}>
      <RadioSelect labelledBy={nativeID} onValueChange={handleSelect} style={styles.radio} value={isSelected} />
      <Text nativeID={nativeID} style={styles.text}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer'
  },
  radio: {
    marginEnd: Theme.Spacing.Small
  },
  text: {}
});

export default SizeKeyPicker;
