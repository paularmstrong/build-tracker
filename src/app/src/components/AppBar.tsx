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
}

export const AppBar = (props: Props): React.ReactElement => {
  const { actionItems, navigationIcon, onPressNavigationIcon, style, title } = props;
  return (
    <View style={[styles.root, style]}>
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
};

const styles = StyleSheet.create({
  root: {
    // @ts-ignore
    position: 'sticky',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.Color.Gray10,
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
    transitionTimingFunction: Theme.MotionTiming.Standard,
    width: '100%'
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

export default React.memo(AppBar);
