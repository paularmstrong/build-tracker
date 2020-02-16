/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import Hoverable from '../Hoverable';
import { hsl } from 'd3-color';
import React from 'react';
import { Th } from '../Table';
import Tooltip from '../Tooltip';
import { ArtifactCell as ACell, GroupCell as GCell } from '@build-tracker/comparator';
import { StyleProp, StyleSheet, Switch, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props {
  cell: ACell | GCell;
  color: string;
  disabled?: boolean;
  isActive: boolean;
  onDisable: (artifactName: string) => void;
  onEnable: (artifactName: string) => void;
  onFocus: (artifactName: string) => void;
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
    onFocus,
    style
  } = props;
  const brighterColor = hsl(color);
  brighterColor.s = 0.2;
  brighterColor.l = 0.8;

  const textRef: React.RefObject<Text> = React.useRef(null);

  const handleValueChange = (toggled: boolean): void => {
    toggled ? onEnable(text) : onDisable(text);
  };

  const handlePress = React.useCallback(() => {
    onFocus(text);
  }, [onFocus, text]);

  return (
    <Th style={style}>
      <View style={styles.artifact}>
        <Hoverable>
          {isHovered => (
            <View>
              <TouchableOpacity accessibilityRole="button" onPress={handlePress} style={styles.name}>
                <Text
                  accessibilityLabel={text}
                  ref={textRef}
                  style={[styles.nameText, isHovered && styles.hoveredText]}
                >
                  {text}
                </Text>
              </TouchableOpacity>
              {isHovered ? <Tooltip relativeTo={textRef} text={`Show "${text}" only`} /> : null}
            </View>
          )}
        </Hoverable>
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
    flexGrow: 1,
    maxWidth: '15vw',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingEnd: Theme.Spacing.Xsmall
  },
  nameText: {
    width: '100%',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    // @ts-ignore
    display: 'block',
    overflow: 'hidden',
    // @ts-ignore
    textOverflow: 'ellipsis'
  },
  switch: {
    paddingStart: Theme.Spacing.Xsmall
  },
  hoveredText: {
    color: Theme.Color.Primary30
  }
});

export default React.memo(ArtifactCell);
