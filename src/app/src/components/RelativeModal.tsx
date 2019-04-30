/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import ReactDOM from 'react-dom';
import { Dimensions, StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';

interface Props {
  accessibilityRole?: ViewProps['accessibilityRole'] | 'menu';
  children?: React.ReactElement | Array<React.ReactElement>;
  onDismiss?: () => void;
  portalRootID?: string;
  relativeTo: React.RefObject<View>;
}

const Menu = (props: Props): React.ReactElement => {
  const { accessibilityRole, children, onDismiss, portalRootID, relativeTo } = props;
  const [position, setPosition] = React.useState({ top: -999, left: 0 });
  const portalRoot = portalRootID && document.getElementById(portalRootID);
  const ref = React.useRef<View>(null);

  const handlePressOutside = React.useCallback((): void => {
    onDismiss && onDismiss();
  }, [onDismiss]);

  React.useEffect(() => {
    if (ref.current && relativeTo.current) {
      const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
      ref.current.measure(
        (_x: number, _y: number, menuWidth: number, menuHeight: number): void => {
          relativeTo.current.measureInWindow(
            (x: number, y: number, _width: number, height: number): void => {
              let top = y + height;
              let left = x;
              // too far right
              if (left + menuWidth > windowWidth) {
                left = windowWidth - menuWidth;
              }
              // too far left
              else if (left < 0) {
                left = 0;
              }
              // too close to bottom
              if (top + menuHeight > windowHeight) {
                top = y - menuHeight;
              }
              ref.current && setPosition({ left, top });
            }
          );
        }
      );
    }
  }, [relativeTo]);

  const menu = (
    <>
      <TouchableOpacity
        activeOpacity={0}
        onPress={handlePressOutside}
        style={StyleSheet.absoluteFill}
        testID="overlay"
      />
      <View
        // @ts-ignore
        accessibilityRole={accessibilityRole}
        ref={ref}
        style={[
          styles.root,
          position.top > 0 && { top: position.top, left: position.left },
          position.top > 0 && styles.show
        ]}
      >
        {React.Children.toArray(children)}
      </View>
    </>
  );

  return portalRoot ? ReactDOM.createPortal(menu, portalRoot) : menu;
};

const styles = StyleSheet.create({
  root: {
    // @ts-ignore
    position: 'absolute',
    backgroundColor: Theme.Color.White,
    borderRadius: Theme.BorderRadius.Normal,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: Theme.Color.Black,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    width: 'auto',
    maxHeight: 400,
    minHeight: '2rem',
    minWidth: 200,
    // @ts-ignore
    transitionProperty: 'transform, opacity',
    transitionDuration: '0.1s',
    transitionTimingFunction: Theme.MotionTiming.Accelerate,
    transform: [{ scale: 0.85 }],
    opacity: 0
  },

  show: {
    transform: [{ scale: 1 }],
    opacity: 1
  }
});

export default Menu;
