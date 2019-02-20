import React from 'react';
import { ArtifactCell as Cell } from '@build-tracker/comparator';
import { Td } from './Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  style?: StyleProp<ViewStyle>;
}

const ArtifactCell = (props: Props): React.ReactElement => {
  return (
    <Td style={props.style}>
      <Text>{props.cell.text}</Text>
    </Td>
  );
};

export default ArtifactCell;
