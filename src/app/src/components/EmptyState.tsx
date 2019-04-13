/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  message: string;
}

const EmptyState = (props: Props): React.ReactElement => {
  const { message } = props;
  return (
    <View style={styles.root}>
      <Text>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EmptyState;
