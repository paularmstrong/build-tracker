/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import Hoverable from './Hoverable';
import React from 'react';
import Ripple from './Ripple';
import { v4 as uuid } from 'uuid';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface Props {
  icon?: React.ComponentType<{ style?: StyleProp<ViewStyle & TextStyle> }>;
  isHighlighted?: boolean;
  label: string;
  nativeID?: string;
  onPress?: () => void;
}

const Item = (props: Props): React.ReactElement => {
  const { icon: Icon, isHighlighted, label, nativeID, onPress } = props;
  const textNativeID = React.useMemo(() => nativeID || uuid(), [nativeID]);

  return (
    <Hoverable>
      {isHovered => (
        <Ripple
          // @ts-ignore
          accessibilityRole="menuitem"
          nativeID={nativeID}
          onPress={onPress}
          style={[styles.root, (isHighlighted || isHovered) && styles.rootHover]}
        >
          <View style={styles.content}>
            {Icon ? <Icon aria-labelledby={textNativeID} style={[styles.icon, isHovered && styles.iconHover]} /> : null}
            <Text nativeID={textNativeID}>{label}</Text>
          </View>
        </Ripple>
      )}
    </Hoverable>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: 'auto',
    maxWidth: 300,
    transitionProperty: 'background-color',
    transitionDuration: '0.2s',
    transitionTimingFunction: Theme.MotionTiming.Standard
  },

  rootHover: {
    backgroundColor: 'rgba(0,0,0,0.1)'
  },

  content: {
    flexDirection: 'row',
    minHeight: '3rem',
    paddingVertical: Theme.Spacing.Xsmall,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: Theme.Spacing.Normal
  },

  icon: {
    color: Theme.Color.Gray30,
    flexGrow: 0,
    fontSize: Theme.FontSize.Medium,
    marginEnd: Theme.Spacing.Normal,
    transitionProperty: 'color',
    transitionDuration: '0.2s',
    transitionTimingFunction: Theme.MotionTiming.Standard
  },
  iconHover: {
    color: Theme.Color.Gray40
  }
});

export default Item;
