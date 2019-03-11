/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import ReactDOM from 'react-dom';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface Props {
  relativeTo: React.RefObject<View>;
  text: string;
}

const tipSpace = 6;

const Tooltip = (props: Props): React.ReactElement => {
  const { relativeTo, text } = props;
  const [position, setPosition] = React.useState({ top: -999, left: 0 });
  const portalRoot = document.getElementById('tooltipPortal');
  const ref: React.RefObject<View> = React.createRef();

  React.useEffect(() => {
    let mounted = true;
    if (relativeTo.current) {
      const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
      ref.current.measure(
        (_x: number, _y: number, tipWidth: number, tipHeight: number): void => {
          if (!mounted) {
            return;
          }
          relativeTo.current.measureInWindow(
            (x: number, y: number, width: number, height: number): void => {
              if (!mounted) {
                return;
              }
              let top = y + height + tipSpace;
              let left = x + width / 2 - tipWidth / 2;
              // too far right when underneath
              if (left + tipWidth > windowWidth) {
                left = x - tipWidth - tipSpace;
                top = y + height / 2 - tipHeight / 2;
              }
              // too far left when underneath
              else if (left < 0) {
                left = x + width + tipSpace;
                top = y + height / 2 - tipHeight / 2;
              }
              // too close to bottom
              else if (top + tipHeight > windowHeight) {
                top = y - tipHeight - tipSpace;
              }

              setPosition({ left, top });
            }
          );
        }
      );
    }
    return () => {
      mounted = false;
    };
  }, [ref, relativeTo]);

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
    maxWidth: 400,
    // @ts-ignore
    position: 'absolute',
    backgroundColor: Theme.Color.Gray50,
    borderRadius: Theme.BorderRadius.Normal,
    paddingHorizontal: Theme.Spacing.Small,
    paddingVertical: Theme.Spacing.Xsmall,
    // @ts-ignore
    transitionProperty: 'transform, opacity',
    transitionDuration: '0.1s',
    transitionTimingFunction: Theme.MotionTiming.Accelerate,
    transform: [{ scale: 0.75 }],
    opacity: 0
  },
  show: {
    transform: [{ scale: 1 }],
    opacity: 1
  },
  // @ts-ignore
  text: {
    color: Theme.TextColor.Gray50,
    fontSize: Theme.FontSize.Xsmall,
    textAlign: 'center'
  }
});

export default Tooltip;
