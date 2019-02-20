import { TextCell as Cell } from '@build-tracker/comparator';
import React from 'react';
import { Td, Th } from './Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  header?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TextCell = (props: Props): React.ReactElement => {
  const El = props.header ? Th : Td;
  return (
    <El style={props.style}>
      <Text>{props.cell.text}</Text>
    </El>
  );
};

export default TextCell;
