/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import Button from './Button';
import Menu from './Menu';
import MoreIcon from '../icons/More';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  navigationIcon?: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
  navigationLabel?: string;
  onPressNavigationIcon?: () => void;
  style?: StyleProp<ViewStyle>;
  title?: React.ReactNode;
  actionItems?: Array<React.ReactNode>;
  overflowItems?: React.ReactElement;
}

export interface Handles {
  dismissOverflow: () => void;
}

export const AppBar = React.forwardRef<Handles, Props>(
  (props: Props, ref: React.Ref<Handles>): React.ReactElement => {
    const { actionItems, navigationIcon, onPressNavigationIcon, overflowItems, style, title } = props;
    const overflowRef = React.useRef<View>(null);
    const [showOverflow, setShowOverflow] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
      dismissOverflow: () => {
        setShowOverflow(false);
      }
    }));

    const handleShowOverflow = React.useCallback(() => {
      setShowOverflow(showOverflow => !showOverflow);
    }, []);

    React.useEffect(() => {
      if (!overflowItems) {
        setShowOverflow(false);
      }
    }, [overflowItems]);

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
        {overflowItems ? (
          <View ref={overflowRef}>
            <Button icon={MoreIcon} iconOnly onPress={handleShowOverflow} title="More actions" />
          </View>
        ) : null}
        {showOverflow && overflowItems ? (
          <Menu onDismiss={handleShowOverflow} relativeTo={overflowRef}>
            {overflowItems}
          </Menu>
        ) : null}
      </View>
    );
  }
);

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
