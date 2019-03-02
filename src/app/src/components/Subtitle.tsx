/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as React from 'react';
import * as Theme from '../theme';
import { StyleSheet, Text } from 'react-native';

interface Props {
  title: string;
}

const Subtitle = (props: Props): React.ReactElement => {
  const { title } = props;
  return (
    <Text
      // @ts-ignore
      style={styles.subtitle}
    >
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  // @ts-ignore
  subtitle: {
    color: Theme.Color.Gray50,
    fontSize: Theme.FontSize.Normal,
    marginBottom: Theme.Spacing.Xsmall
  }
});

export default Subtitle;
