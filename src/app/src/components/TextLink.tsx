/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import Hoverable from './Hoverable';
import React from 'react';
import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

interface Props {
  href: string;
  style?: StyleProp<ViewStyle>;
  text: string;
}

const DrawerLink = (props: Props): React.ReactElement => {
  const { href, style, text } = props;

  return (
    <Hoverable>
      {isHovered => {
        return (
          // @ts-ignore
          <Text
            accessibilityRole="link"
            href={href}
            style={[styles.root, isHovered && styles.rootHovered, style]}
            target="_blank"
          >
            {text}
          </Text>
        );
      }}
    </Hoverable>
  );
};

const styles = StyleSheet.create({
  root: {
    borderRadius: Theme.BorderRadius.Normal,
    color: Theme.Color.Primary40
  },
  rootHovered: {
    backgroundColor: Theme.Color.Primary00
  }
});

export default DrawerLink;
