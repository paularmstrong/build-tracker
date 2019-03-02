/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  color?: string;
}

const Divider = (props: Props): React.ReactElement => {
  const { color } = props;
  return <View style={[styles.root, color && { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
  root: {
    height: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    backgroundColor: Theme.Color.Gray20,
    marginBottom: Theme.Spacing.Normal
  }
});

export default Divider;
