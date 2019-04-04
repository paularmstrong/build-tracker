/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  text: string;
}

const Snackbar = (props: Props): React.ReactElement => {
  const { text } = props;
  return (
    // @ts-ignore
    <View accessibilityRole="alert" style={styles.root}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: Theme.Spacing.Normal,
    left: Theme.Spacing.Normal,
    width: 'auto',
    paddingVertical: Theme.Spacing.Small,
    paddingHorizontal: Theme.Spacing.Normal,
    backgroundColor: Theme.Color.Black,
    borderRadius: Theme.BorderRadius.Normal,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: Theme.Color.Black,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    animationKeyframes: [
      {
        from: { transform: [{ scale: 0.85 }], opacity: 0 },
        to: { transform: [{ scale: 1 }], opacity: 1 }
      }
    ],
    animationDuration: '0.1s',
    animationTimingFunction: Theme.MotionTiming.Accelerate,
    animationIterationCount: 1
  },
  text: {
    color: Theme.TextColor.Black
  }
});

export default Snackbar;
