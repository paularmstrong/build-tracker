/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactElement;
  disabled?: boolean;
  rippleColor?: string | 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
}

const Ripple = (props: Props & TouchableOpacityProps): React.ReactElement => {
  const [location, setLocation] = React.useState({ x: 0, y: 0 });
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [showRipple, setRippleVisibility] = React.useState(false);

  const rootRef: React.RefObject<View> = React.useRef(null);

  const { children, disabled, rippleColor = 'rgba(0,0,0,0.2)', onPressIn, onPressOut, style, ...otherProps } = props;

  const handleLayout = React.useCallback((event): void => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  const handlePressIn = React.useCallback(
    (event): void => {
      const { locationX, locationY } = event.nativeEvent;
      if (!disabled) {
        setRippleVisibility(true);
        setLocation({
          x: Math.floor(locationX - window.scrollX),
          y: Math.floor(locationY - window.scrollY)
        });

        if (onPressIn) {
          onPressIn(event);
        }
      }
    },
    [disabled, onPressIn]
  );

  const handlePressOut = React.useCallback(
    (event): void => {
      if (disabled) {
        return;
      }
      setTimeout(() => {
        rootRef.current && setRippleVisibility(false);
      }, 400);
      if (onPressOut) {
        onPressOut(event);
      }
    },
    [disabled, onPressOut, setRippleVisibility]
  );

  const maxSide = Math.max(size.width, size.height);
  const sizeMidpoint = maxSide / 2;
  const offset = Math.max(Math.abs(location.x - sizeMidpoint), Math.abs(location.y - sizeMidpoint));
  const finalSize = maxSide + offset * 2.5;

  return (
    <TouchableOpacity
      {...otherProps}
      activeOpacity={1}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.wrapper}
    >
      <View onLayout={handleLayout} style={[styles.root, style]} ref={rootRef}>
        {children}
        <View
          style={[
            styles.ripple,
            { backgroundColor: rippleColor },
            showRipple ? { width: finalSize, height: finalSize } : null,
            showRipple ? styles.animateIn : styles.animateOut,
            {
              left: location.x - finalSize / 2,
              top: location.y - finalSize / 2
            }
          ]}
        >
          <View style={styles.adjuster} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // @ts-ignore
    display: 'inline-flex'
  },
  root: {
    // @ts-ignore
    display: 'inline-flex',
    overflow: 'hidden',
    position: 'relative'
  },
  ripple: {
    position: 'absolute',
    borderRadius: 9999,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    zIndex: -1,
    opacity: 0,
    // @ts-ignore
    transitionProperty: 'transform, opacity',
    transitionDuration: '0.4s',
    transitionTimingFunction: Theme.MotionTiming.Standard,
    transformOrigin: '50% 50%',
    transform: [{ scale: 0 }]
  },

  adjuster: {
    // @ts-ignore
    display: 'block',
    paddingTop: '100%',
    height: 0,
    width: 0
  },

  animateIn: {
    opacity: 1,
    transform: [{ scale: 1 }]
  },

  animateOut: {
    // @ts-ignore
    animationKeyframes: [{ from: { opacity: 1 }, to: { opacity: 0 } }],
    animationDuration: '0.2s',
    animationIterationCount: 1,
    transitionDelay: '0.2s',
    transitionDuration: '0s',
    width: 0,
    height: 0,
    transform: [{ scale: 0 }],
    opacity: 0
  }
});

export default Ripple;
