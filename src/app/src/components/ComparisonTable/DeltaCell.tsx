import React from 'react';
import { DeltaCell as Cell } from '@build-tracker/comparator';
import { Td } from './Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  style?: StyleProp<ViewStyle>;
}

const DeltaCell = (props: Props): React.ReactElement => {
  return (
    <Td style={props.style}>
      <Text>{JSON.stringify(props.cell.sizes)}</Text>
    </Td>
  );
};

export default DeltaCell;
