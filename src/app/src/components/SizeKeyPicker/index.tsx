import * as Theme from '../../theme';
import React from 'react';
import SizeKeyButton from './SizeKeyButton';
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
        <SizeKeyButton isSelected={selected === key} key={key} onSelect={onSelect} style={styles.button} value={key} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    marginHorizontal: Theme.Spacing.Normal,
    marginBottom: Theme.Spacing.Normal
  },
  button: {
    marginEnd: Theme.Spacing.Normal
  }
});

export default SizeKeyPicker;
