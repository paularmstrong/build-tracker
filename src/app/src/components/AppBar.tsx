import * as Theme from '../theme';
import Button from './Button';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  navigationIcon?: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
  navigationLabel?: string;
  onPressNavigationIcon?: () => void;
  style?: StyleProp<ViewStyle>;
  title?: React.ReactNode;
  actionItems?: Array<React.ReactNode>;
  // TODO:
  // overflowMenu
}

class AppBar extends React.Component<Props> {
  private _ref: React.RefObject<View> = React.createRef();
  private _hidden = false;
  private _prevYScroll = 0;

  public render(): React.ReactNode {
    const { actionItems, navigationIcon, onPressNavigationIcon, style, title } = this.props;
    return (
      <View ref={this._ref} style={[styles.root, style]}>
        {navigationIcon ? (
          <Button
            color="primary"
            icon={navigationIcon}
            iconOnly
            onPress={onPressNavigationIcon}
            style={styles.icon}
            title="Menu"
          />
        ) : null}
        {typeof title === 'string' ? (
          <Text
            // @ts-ignore
            accessibilityRole="heading"
            style={styles.title}
          >
            {title}
          </Text>
        ) : (
          title || null
        )}
        <View style={styles.actionItems}>{React.Children.toArray(actionItems)}</View>
      </View>
    );
  }

  public setYScrollPosition = (yPos: number) => {
    const yDiff = yPos - this._prevYScroll;

    if (!this._hidden && yDiff > 20) {
      this.hide();
    }

    if (this._hidden && yDiff < -20) {
      this.show();
    }

    if (yPos <= 5) {
      this._hideShadow();
    }

    this._prevYScroll = yPos;
  };

  public hide = () => {
    const { style } = this.props;
    this._hidden = true;
    this._ref.current.setNativeProps({ style: [styles.root, styles.hidden, style] });
  };

  public show = () => {
    const { style } = this.props;
    this._hidden = false;
    this._ref.current.setNativeProps({
      style: [styles.root, styles.overContent, style]
    });
  };

  private _hideShadow = () => {
    const { style } = this.props;
    this._ref.current.setNativeProps({
      style: [styles.root, style]
    });
  };
}

const styles = StyleSheet.create({
  root: {
    // @ts-ignore
    position: 'sticky',
    top: 0,
    minHeight: '4rem',
    backgroundColor: Theme.Color.White,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    shadowOpacity: 0,
    padding: Theme.Spacing.Small,
    alignItems: 'center',
    zIndex: 10,
    transitionProperty: 'top, box-shadow',
    transitionDuration: '0.2s',
    transitionTimingFunction: Theme.MotionTiming.Standard
  },

  hidden: {
    top: '-5rem'
  },

  overContent: {
    shadowColor: Theme.Color.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6
  },

  icon: {
    marginEnd: Theme.Spacing.Small
  },

  // @ts-ignore
  title: {
    fontSize: Theme.FontSize.Normal,
    fontWeight: Theme.FontWeight.Bold,
    color: Theme.Color.Primary40
  },

  actionItems: {
    marginStart: 'auto'
  }
});

export default AppBar;
