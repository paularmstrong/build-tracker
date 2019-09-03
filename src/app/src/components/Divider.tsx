/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const Divider = (props: Props): React.ReactElement => {
  const { color, style } = props;
  return <View style={[styles.root, color && { backgroundColor: color }, style]} />;
};

const styles = StyleSheet.create({
  root: {
    height: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    backgroundColor: Theme.Color.Gray20
  }
});

export default Divider;
