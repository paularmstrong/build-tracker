import React from 'react';
import { ArtifactCell as Cell } from '@build-tracker/comparator';
import { Th } from './Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  style?: StyleProp<ViewStyle>;
}

const ArtifactCell = (props: Props): React.ReactElement => {
  return (
    <Th style={props.style}>
      <Text>{props.cell.text}</Text>
    </Th>
  );
};

export default ArtifactCell;
