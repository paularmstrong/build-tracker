/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import ColorScales from '../../modules/ColorScale';
import RadioSelect from '../RadioSelect';
import React from 'react';
import { setColorScale } from '../../store/actions';
import { useDispatch } from 'redux-react-hook';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  isSelected?: boolean;
  name: keyof typeof ColorScales;
  style?: StyleProp<ViewStyle>;
}

export const ColorScale = (props: Props): React.ReactElement => {
  const { isSelected, name, style } = props;

  const dispatch = useDispatch();
  const handleSelect = React.useCallback(
    (checked: boolean) => {
      if (checked) {
        dispatch(setColorScale(name));
      }
    },
    [dispatch, name]
  );

  const nativeID = `radio${`${name}`.replace(/^\w/g, '')}`;

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
