/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  children: React.ReactElement | Array<React.ReactElement>;
  header?: React.ReactElement<typeof View>;
  hidden?: boolean;
}

export interface Handles {
  show: () => void;
}
const Drawer: React.RefForwardingComponent<Handles, Props> = (
  props: Props,
  ref: React.RefObject<Handles>
): React.ReactElement => {
  const { children, header, hidden = false } = props;
  const [forceShow, setForceShow] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    show: () => {
      setForceShow(true);
    },
  }));

  const hideDrawerHandler = React.useCallback(() => {
    setForceShow(false);
  }, []);

  return (
    <React.Fragment>
      {
        <TouchableOpacity
          activeOpacity={0.32}
          onPress={hideDrawerHandler}
          pointerEvents={forceShow ? 'box-only' : 'none'}
          style={[styles.scrim, hidden && forceShow && styles.showScrim]}
        />
      }

      <ScrollView
        accessibilityRole="nav"
        aria-hidden={hidden && !forceShow}
        style={[styles.root, hidden && styles.hidden, forceShow && styles.forceShow]}
      >
        {header || null}
        <>{children}</>
      </ScrollView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100vh',
    width: 300,
    maxWidth: 300,
    paddingHorizontal: Theme.Spacing.Normal,
    backgroundColor: Theme.Color.White,
    overflowY: 'scroll',
    overflowX: 'hidden',
    left: 0,
    transitionProperty: 'left',
    transitionDuration: '0.25s',
    transitionTimingFunction: Theme.MotionTiming.Decelerate,
    zIndex: 10,
  },

  hidden: {
    position: 'absolute',
    left: -300,
    transitionProperty: 'left, box-shadow',
    shadowColor: Theme.Color.Black,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 35,
  },

  forceShow: {
    left: 0,
    shadowOpacity: 0.5,
  },

  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9,
    backgroundColor: Theme.Color.Black,
    width: '100vw',
    height: '100vh',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '0.25s',
    transitionTimingFunction: Theme.MotionTiming.Decelerate,
  },

  showScrim: {
    opacity: 0.32,
  },
});

export default React.forwardRef(Drawer);
