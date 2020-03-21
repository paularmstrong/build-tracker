/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import ReactDOM from 'react-dom';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface Props {
  top: number;
  left: number;
  text: string;
}

const TIP_SPACE = 6;

const Tooltip = (props: Props): React.ReactElement => {
  const { left, text, top } = props;
  const [position, setPosition] = React.useState({ top: -999, left: 0 });
  const portalRoot = document.getElementById('tooltipPortal');
  const ref: React.RefObject<View> = React.createRef();

  React.useEffect(() => {
    let mounted = true;
    const { width: windowWidth } = Dimensions.get('window');
    ref.current.measure((_x: number, _y: number, tipWidth: number, tipHeight: number): void => {
      if (!mounted) {
        return;
      }
      let newTop = top - TIP_SPACE - tipHeight;
      let newLeft = left - Math.round(tipWidth / 2);
      // too far right
      if (newLeft + tipWidth + TIP_SPACE > windowWidth) {
        newLeft = left - tipWidth - TIP_SPACE;
        newTop = top - Math.round(tipHeight / 2);
      }
      // too far left
      else if (newLeft < TIP_SPACE) {
        newLeft = left + TIP_SPACE;
        newTop = top - Math.round(tipHeight / 2);
      }
      // too close to top
      else if (newTop <= TIP_SPACE) {
        newTop = top + tipHeight + TIP_SPACE;
      }

      setPosition({ left: newLeft, top: newTop });
    });
    return () => {
      mounted = false;
    };
    /* eslint-disable react-hooks/exhaustive-deps */
    // Tests break if you pass the ref/relativeTo higher object in and not the actual value we're using
  }, [ref.current, left, top]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const tooltip = (
    <View
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
    maxWidth: 400,
    position: 'absolute',
    pointerEvents: 'none',
    backgroundColor: `${Theme.Color.Gray50}EE`,
    borderRadius: Theme.BorderRadius.Normal,
    paddingHorizontal: Theme.Spacing.Small,
    paddingVertical: Theme.Spacing.Xsmall,
    transitionProperty: 'transform, opacity',
    transitionDuration: '0.1s',
    transitionTimingFunction: Theme.MotionTiming.Accelerate,
    transform: [{ scale: 0.75 }],
    opacity: 0,
  },
  show: {
    transform: [{ scale: 1 }],
    opacity: 1,
  },
  text: {
    color: Theme.TextColor.Gray50,
    fontSize: Theme.FontSize.Xsmall,
  },
});

export default Tooltip;
