import * as Theme from '../../theme';
import { ArtifactCell as Cell } from '@build-tracker/comparator';
import { hsl } from 'd3-color';
import React from 'react';
import { Th } from './Table';
import { StyleProp, StyleSheet, Switch, Text, View, ViewStyle } from 'react-native';

interface Props {
  color: string;
  cell: Cell;
  style?: StyleProp<ViewStyle>;
}

const ArtifactCell = (props: Props): React.ReactElement => {
  const { cell, color, style } = props;
  const brighterColor = hsl(color);
  brighterColor.s = 0.2;
  brighterColor.l = 0.8;

  const handleValueChange = (toggled: boolean): void => {
    // TODO: handle toggling
    toggled;
  };

  return (
    <Th style={style}>
      <View style={styles.artifact}>
        <View style={styles.name}>
          <Text>{cell.text}</Text>
        </View>
        <View style={styles.switch}>
          {
            // @ts-ignore
            <Switch
              activeThumbColor={color}
              activeTrackColor={brighterColor.toString()}
              onValueChange={handleValueChange}
              value
            />
          }
        </View>
      </View>
    </Th>
  );
};

const styles = StyleSheet.create({
  artifact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Theme.Spacing.Xxsmall
  },
  name: {
    flexShrink: 1,
    justifyContent: 'center',
    paddingEnd: Theme.Spacing.Xsmall
  },
  switch: {
    paddingStart: Theme.Spacing.Xsmall
  }
});

export default ArtifactCell;
