/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { RevisionDeltaCell as Cell } from '@build-tracker/comparator';
import React from 'react';
import { Th } from './../Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  style?: StyleProp<ViewStyle>;
}

const RevisionDeltaCell = (props: Props): React.ReactElement => {
  const { againstRevision, deltaIndex, revision } = props.cell;
  return (
    <Th accessibilityLabel={`Delta from ${againstRevision} to ${revision}`} style={props.style}>
      <Text>{`𝚫${deltaIndex}`}</Text>
    </Th>
  );
};

export default React.memo(RevisionDeltaCell);
