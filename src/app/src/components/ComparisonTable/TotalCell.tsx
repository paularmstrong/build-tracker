import { TotalCell as Cell } from '@build-tracker/comparator';
import { formatBytes } from '@build-tracker/formatting';
import React from 'react';
import { Td } from './Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  sizeKey: string;
  style?: StyleProp<ViewStyle>;
}

export const TotalCell = (props: Props): React.ReactElement => {
  const { cell, sizeKey, style } = props;
  const value = cell.sizes[sizeKey];
  return (
    <Td style={style}>
      <Text>{value === 0 ? '' : formatBytes(value)}</Text>
    </Td>
  );
};

export default React.memo(TotalCell);
