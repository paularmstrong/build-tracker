import { formatBytes } from '@build-tracker/formatting';
import React from 'react';
import { DeltaCell as Cell } from '@build-tracker/comparator';
import { Td } from './Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  sizeKey: string;
  style?: StyleProp<ViewStyle>;
}

const DeltaCell = (props: Props): React.ReactElement => {
  const { cell, sizeKey, style } = props;
  return (
    <Td style={style}>
      <Text>{formatBytes(cell.sizes[sizeKey])}</Text>
    </Td>
  );
};

export default DeltaCell;
