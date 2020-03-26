/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import { setSizeKey } from '../../store/actions';
import SizeKey from './Key';
import { State } from '../../store/types';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  keys: Array<string>;
}

const SizeKeyPicker = (props: Props): React.ReactElement => {
  const { keys } = props;
  const selected = useSelector((state: State) => state.sizeKey);
  const dispatch = useDispatch();
  const handleSelect = React.useCallback(
    (key: string): void => {
      dispatch(setSizeKey(key));
    },
    [dispatch]
  );
  return (
    <View style={styles.root}>
      {keys.map((key) => (
        <SizeKey isSelected={selected === key} key={key} onSelect={handleSelect} style={styles.button} value={key} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  button: {},
});

export default SizeKeyPicker;
