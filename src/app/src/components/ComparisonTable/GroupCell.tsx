/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import { GroupCell as GCell } from '@build-tracker/comparator';
import { hsl } from 'd3-color';
import React from 'react';
import { Th } from './../Table';
import { StyleProp, StyleSheet, Switch, Text, View, ViewStyle } from 'react-native';

interface Props {
  cell: GCell;
  color: string;
  disabled?: boolean;
  isActive: boolean;
  onDisable: (artifactNames: Array<string>) => void;
  onEnable: (artifactNames: Array<string>) => void;
  style?: StyleProp<ViewStyle>;
}

export const GroupCell = (props: Props): React.ReactElement => {
  const {
    cell: { artifactNames, text },
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

  const handleValueChange = React.useCallback(
    (toggled: boolean): void => {
      toggled ? onEnable(artifactNames) : onDisable(artifactNames);
    },
    [artifactNames, onDisable, onEnable]
  );

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

export default React.memo(GroupCell);
