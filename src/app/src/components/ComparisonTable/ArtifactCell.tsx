/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import { ArtifactCell as Cell } from '@build-tracker/comparator';
import { hsl } from 'd3-color';
import React from 'react';
import { Th } from './Table';
import { StyleProp, StyleSheet, Switch, Text, View, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  color: string;
  disabled?: boolean;
  isActive: boolean;
  onDisable: (artifactName: string) => void;
  onEnable: (artifactName: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const ArtifactCell = (props: Props): React.ReactElement => {
  const {
    cell: { text },
    color,
    disabled,
    isActive,
    onDisable,
    onEnable,
    style
  } = props;
  const brighterColor = hsl(color);
  brighterColor.s = 0.2;
  brighterColor.l = 0.8;

  const handleValueChange = (toggled: boolean): void => {
    toggled ? onEnable(text) : onDisable(text);
  };

  return (
    <Th style={style}>
      <View style={styles.artifact}>
        <View style={styles.name}>
          <Text>{text}</Text>
        </View>
        <View style={styles.switch}>
          {
            // @ts-ignore
            <Switch
              activeThumbColor={color}
              activeTrackColor={brighterColor.toString()}
              disabled={disabled}
              onValueChange={handleValueChange}
              value={isActive}
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

export default React.memo(ArtifactCell);
