/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import Hoverable from './Hoverable';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  href: string;
  icon?: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
  style?: StyleProp<ViewStyle>;
  text: string;
}

const DrawerLink = (props: Props): React.ReactElement => {
  const { href, icon: Icon = null, style, text } = props;

  return (
    <Hoverable>
      {isHovered => {
        return (
          // @ts-ignore
          <View
            accessibilityRole="link"
            href={href}
            style={[styles.root, isHovered && styles.rootHovered, style]}
            target="_blank"
          >
            <Text style={[styles.text, isHovered && styles.textHovered]}>
              <>
                {Icon ? <Icon style={styles.icon} /> : null}
                {text}
              </>
            </Text>
          </View>
        );
      }}
    </Hoverable>
  );
};

const styles = StyleSheet.create({
  root: {
    marginBottom: Theme.Spacing.Small,
    marginHorizontal: `calc(-1 * ${Theme.Spacing.Xsmall})`,
    borderRadius: Theme.BorderRadius.Normal,
    padding: Theme.Spacing.Xsmall
  },
  rootHovered: {
    backgroundColor: Theme.Color.Primary00
  },
  // @ts-ignore
  text: {
    fontSize: Theme.FontSize.Normal
  },
  textHovered: {
    color: Theme.Color.Primary40
  },
  icon: {
    marginEnd: Theme.Spacing.Small
  }
});

export default DrawerLink;
