/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { RevisionDeltaCell as Cell } from '@build-tracker/comparator';
import { formatSha } from '@build-tracker/formatting';
import Hoverable from '../Hoverable';
import React from 'react';
import { Th } from '../Table';
import Tooltip from '../Tooltip';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  style?: StyleProp<ViewStyle>;
}

export const RevisionDeltaCell = (props: Props): React.ReactElement => {
  const { againstRevision, deltaIndex, revision } = props.cell;
  const viewRef = React.useRef(null);

  return (
    <Th accessibilityLabel={`Delta from ${againstRevision} to ${revision}`} style={props.style}>
      <Hoverable>
        {isHovered => (
          <View ref={viewRef} testID="delta">
            <Text style={styles.delta}>{`𝚫${deltaIndex}`}</Text>
            {isHovered ? (
              <Tooltip
                relativeTo={viewRef}
                text={`Delta from ${formatSha(againstRevision)} to ${formatSha(revision)}`}
              />
            ) : null}
          </View>
        )}
      </Hoverable>
    </Th>
  );
};

const styles = StyleSheet.create({
  delta: {
    fontWeight: 'bold'
  }
});

export default React.memo(RevisionDeltaCell);
