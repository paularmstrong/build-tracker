import React from 'react';
import { RevisionCell } from '@build-tracker/comparator';
import { Th } from './Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: RevisionCell;
  style?: StyleProp<ViewStyle>;
}

const RevisionCell = (props: Props): React.ReactElement => {
  return (
    <Th style={props.style}>
      <Text>{props.cell.revision}</Text>
    </Th>
  );
};

export default RevisionCell;
