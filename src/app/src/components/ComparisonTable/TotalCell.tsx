import React from 'react';
import { TotalCell as Cell } from '@build-tracker/comparator';
import { Td } from './Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  style?: StyleProp<ViewStyle>;
}

const TotalCell = (props: Props): React.ReactElement => {
  return (
    <Td style={props.style}>
      <Text>{JSON.stringify(props.cell.sizes)}</Text>
    </Td>
  );
};

export default TotalCell;
