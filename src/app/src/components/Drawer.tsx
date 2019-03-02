/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  // @ts-ignore TODO: Add Destination child type
  children: React.ReactElement | Array<React.ReactElement>;
  header?: React.ReactElement<typeof View>;
  hidden?: boolean;
}

interface State {
  forceShow: boolean;
}

class Drawer extends React.Component<Props, State> {
  public static defaultProps = {
    hidden: false
  };
  public state = { forceShow: false };

  public shouldComponentUpdate(_: Props, prevState: State): boolean {
    const { hidden } = this.props;
    const { forceShow } = this.state;
    return !hidden || forceShow || forceShow !== prevState.forceShow;
  }

  // TODO: on route change, hide the drawer

  public render(): React.ReactNode {
    const { children, header, hidden } = this.props;
    const { forceShow } = this.state;
    return (
      <React.Fragment>
        {
          // @ts-ignore pointerEvents is web-only
          <TouchableOpacity
            activeOpacity={0.32}
            onPress={this._hideDrawer}
            pointerEvents={forceShow ? 'box-only' : 'none'}
            style={[styles.scrim, hidden && forceShow && styles.showScrim]}
          />
        }

        <ScrollView
          // @ts-ignore
          accessibilityRole="nav"
          aria-hidden={hidden && !forceShow}
          style={[styles.root, hidden && styles.hidden, forceShow && styles.forceShow]}
        >
          {header || null}
          <>{children}</>
        </ScrollView>
      </React.Fragment>
    );
  }

  public show = () => {
    this.setState({ forceShow: true });
  };

  private _hideDrawer = () => {
    this.setState({ forceShow: false });
  };
}

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
    zIndex: 10
  },

  hidden: {
    position: 'absolute',
    left: -300,
    transitionProperty: 'left, box-shadow',
    shadowColor: Theme.Color.Black,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 35
  },

  forceShow: {
    left: 0,
    shadowOpacity: 0.5
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
    transitionTimingFunction: Theme.MotionTiming.Decelerate
  },

  showScrim: {
    opacity: 0.32
  }
});

export default Drawer;
