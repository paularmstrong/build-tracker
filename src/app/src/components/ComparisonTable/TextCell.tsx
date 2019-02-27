/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { TextCell as Cell } from '@build-tracker/comparator';
import React from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';
import { Td, Th } from './../Table';

interface Props {
  cell: Cell;
  header?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const TextCell = (props: Props): React.ReactElement => {
  const El = props.header ? Th : Td;
  return (
    <El style={props.style}>
      <Text>{props.cell.text}</Text>
    </El>
  );
};

export default React.memo(TextCell);
