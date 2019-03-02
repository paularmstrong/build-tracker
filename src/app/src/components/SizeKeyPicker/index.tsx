/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import SizeKey from './Key';
import { StyleSheet, View } from 'react-native';

interface Props {
  keys: Array<string>;
  onSelect: (key: string) => void;
  selected: string;
}

const SizeKeyPicker = (props: Props): React.ReactElement => {
  const { keys, onSelect, selected } = props;
  return (
    <View style={styles.root}>
      {keys.map(key => (
        <SizeKey isSelected={selected === key} key={key} onSelect={onSelect} style={styles.button} value={key} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  button: {}
});

export default SizeKeyPicker;
