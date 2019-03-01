/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import ReactDOM from 'react-dom';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  relativeTo: React.RefObject<View>;
  text: string;
}

const Tooltip = (props: Props): React.ReactElement => {
  const { relativeTo, text } = props;
  const [position, setPosition] = React.useState({ top: -999, left: 0 });
  const portalRoot = document.getElementById('tooltipPortal');
  const ref: React.RefObject<View> = React.createRef();

  React.useEffect(() => {
    if (relativeTo.current) {
      ref.current.measure(
        (_x: number, _y: number, tipWidth: number): void => {
          relativeTo.current.measureInWindow(
            (x: number, y: number, width: number, height: number): void => {
              setPosition({ top: y + height + 6, left: x + width / 2 - tipWidth / 2 });
            }
          );
        }
      );
    }
  });

  const tooltip = (
    <View
      // @ts-ignore
      accessibilityRole="tooltip"
      ref={ref}
      style={[styles.root, { top: position.top, left: position.left }, position.top > 0 && styles.show]}
    >
      <Text style={styles.text}>{text}</Text>
    </View>
  );

  return portalRoot ? ReactDOM.createPortal(tooltip, portalRoot) : tooltip;
};

const styles = StyleSheet.create({
  root: {
    // @ts-ignore
    position: 'absolute',
    backgroundColor: Theme.Color.Gray50,
    borderRadius: Theme.BorderRadius.Normal,
    paddingHorizontal: Theme.Spacing.Normal,
    paddingVertical: Theme.Spacing.Xsmall,
    transitionProperty: 'transform, opacity',
    transitionDuration: '0.15s',
    transitionTimingFunction: Theme.MotionTiming.Accelerate,
    transform: [{ scale: 0.75 }],
    opacity: 0
  },
  show: {
    transform: [{ scale: 1 }],
    opacity: 1
  },
  text: {
    color: Theme.TextColor.Gray50,
    textAlign: 'center'
  }
});

export default Tooltip;
